import React, { useState, useCallback, useEffect } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { format } from 'date-fns';

import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import DateSelector from '../../components/DateSelector';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';

import {
    menuSelectedTextAvailable,
    styles,
    Text,
    TextTitle,
    HelpDescription,
    HelpSubTitle,
    HelpTitle,
} from './styles';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import HelpHeader from '../../components/HelpHeader';
import helpImage from '../../../assets/helpImage.jpg';
import Loading from '../Loading';
import Button from '../../components/Button';
import FoundHelpInfo from '../../components/FoundHelpInfo';
import { cepPattern } from '../../utils/RegexPatterns';

interface HelpDateType {
    id: string;
    name: string;
    groupName: string;
}

export interface HelpDateFiltered {
    id: string;
    date: Date;
    help: {
        id: string;
        title: string;
        description: string;
        observation?: string;
        imageName?: string;
        needy: {
            id: string;
            name: string;
            email: string;
            showContact: boolean;
            ddd: string;
            phoneNumber: string;
        };
        address: {
            id: string;
            addressZipCode: string;
            addressStreet: string;
            addressNumber: string;
            addressComplement: string;
            addressArea: string;
            addressCity: string;
            addressState: string;
        };
        userManager: {
            id: string;
            name: string;
            email: string;
            cpf: number;
            ddd: number;
            phoneNumber: number;
        };
    };
    type: {
        id: string;
        name: string;
    };
}

const NewHelp: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [formStage, setFormStage] = useState<'1' | '2' | '3'>('1');
    const [loading, setLoading] = useState(false);

    // PRIMEIRA TELA
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [finalDate, setFinalDate] = useState<Date>(new Date());
    const [helpDateTypes, setHelpDateTypes] = useState<HelpDateType[]>();
    const [helpDateType, setHelpDateType] = useState<HelpDateType>({} as HelpDateType);
    const [helpDateFiltered, setHelpDateFiltered] = useState<HelpDateFiltered[]>([] as HelpDateFiltered[]);
    const [activeHelpDate, setActiveHelpDate] = useState<HelpDateFiltered>({} as HelpDateFiltered);

    const handleHelpSearch = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.post('/help/filterHelp', {
                initialDate,
                finalDate,
                helpDateType,
            });

            setHelpDateFiltered(data);

            if ((data && data.length <= 0) || data === undefined) {
                Alert.alert('Sem resultados', 'Nenhuma ajuda encontrada com esses critérios.');
            } else {
                setFormStage('2');
            }

            setLoading(false);
        } catch (e) {
            Alert.alert('Erro', 'Erro ao buscar ajudas.');
            setLoading(false);
        }
    }, [initialDate, finalDate, helpDateType]);

    useEffect(() => {
        let mounted = true;

        async function getHelpTypes(): Promise<void> {
            await api
                .get('type/helpedDate')
                .then((response) => {
                    if (mounted) {
                        setHelpDateTypes(response.data);
                        setHelpDateType(response.data[0]);
                    }
                })
                .catch((e) => {
                    Alert.alert('Houve um erro ao buscar tipos de ajudas');
                    // // console.log('Houve um erro ao buscar os dados!', e);
                });
        }

        if (mounted) {
            getHelpTypes();
        }

        return () => {
            mounted = false;
        };
    }, []);

    const handleActiveHelp = useCallback((chosenHelp: HelpDateFiltered) => {
        setActiveHelpDate(chosenHelp);

        setFormStage('3');
    }, []);

    const handleSetVolunteerToHelp = useCallback(async () => {
        try {
            setLoading(true);

            await api.put('/helpDate', {
                id: activeHelpDate.id,
                userVolunteer: user.id,
            });

            setLoading(false);

            Alert.alert('Sucesso', 'Você entrou como voluntário nessa ajuda');

            navigation.navigate(ScreenNamesEnum.Main);
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível adicionar voluntário na ajuda');
            setLoading(false);
        }
    }, [user.id, activeHelpDate.id, navigation]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {/* FIRST PART */}
            {formStage === '1' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader
                            isFindHelpDate
                            navigateToMain={() => navigation.navigate(ScreenNamesEnum.Main)}
                            formCurrentStage={formStage}
                            formTotalStages="3"
                        />

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <View>
                                <DateSelector
                                    title="Data inicial"
                                    setChosenDate={(selected) => setInitialDate(selected)}
                                    initialDate={initialDate}
                                />
                            </View>
                            <View>
                                <DateSelector
                                    title="Data final"
                                    setChosenDate={(selected) => setFinalDate(selected)}
                                    initialDate={finalDate}
                                />
                            </View>
                            {helpDateTypes && (
                                <Menu style={styles.menuContainer}>
                                    <MenuTrigger
                                        customStyles={menuSelectedTextAvailable}
                                        text={helpDateType.name}
                                    />

                                    <MenuOptions
                                        customStyles={{
                                            optionsContainer: styles.menuWrapper,
                                        }}
                                    >
                                        <ScrollView style={{ maxHeight: 400 }}>
                                            {helpDateTypes.map((type) => (
                                                <MenuOption
                                                    key={type.id}
                                                    style={styles.menuOption}
                                                    onSelect={() => {
                                                        setHelpDateType(type);
                                                    }}
                                                >
                                                    <Text>{type.name}</Text>
                                                </MenuOption>
                                            ))}
                                        </ScrollView>
                                    </MenuOptions>
                                </Menu>
                            )}
                        </ScrollView>

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="ENCONTRAR"
                            titleForwardButton="next"
                            backFunction={() => navigation.navigate(ScreenNamesEnum.Main)}
                            forwardFunction={() => handleHelpSearch()}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART */}
            {formStage === '2' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader
                            isFindHelpDate
                            navigateToMain={() => setFormStage('1')}
                            formCurrentStage={formStage}
                            formTotalStages="3"
                        />

                        <ScrollView style={{ marginTop: '6%' }}>
                            {helpDateFiltered &&
                                helpDateFiltered.length > 0 &&
                                helpDateFiltered.map((helpDateFi) => (
                                    <FoundHelpInfo
                                        date={helpDateFi.date}
                                        help={helpDateFi.help}
                                        id={helpDateFi.id}
                                        type={helpDateFi.type}
                                        onPress={() => handleActiveHelp(helpDateFi)}
                                    />
                                ))}
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* THIRD PART */}
            {formStage === '3' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader
                            navigateToMain={() => navigation.navigate(ScreenNamesEnum.Main)}
                            isFindHelpDate
                            formCurrentStage={formStage}
                            formTotalStages="3"
                        />

                        <ScrollView style={{ marginTop: '6%' }}>
                            <HelpTitle style={{ marginLeft: '3%' }}>
                                Ajuda para {activeHelpDate.help.needy.name}
                            </HelpTitle>
                            <Image
                                style={{ width: 350, height: 200, alignSelf: 'center', marginTop: '3%' }}
                                source={helpImage}
                            />
                            <View style={{ margin: '3%' }}>
                                <HelpSubTitle>Título: {activeHelpDate.help.title}</HelpSubTitle>

                                <HelpDescription>
                                    {activeHelpDate.help.description} {'\n'} Obs:{' '}
                                    {activeHelpDate.help.observation ? activeHelpDate.help.observation : ''}
                                </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Local: </HelpSubTitle>

                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {activeHelpDate.help.address.addressStreet}{' '}
                                    {activeHelpDate.help.address.addressNumber},{' '}
                                    {activeHelpDate.help.address.addressArea},{' '}
                                    {activeHelpDate.help.address.addressCity}{' '}
                                    {activeHelpDate.help.address.addressState}{' '}
                                </HelpDescription>
                                <HelpDescription>
                                    CEP:{' '}
                                    {activeHelpDate.help.address.addressZipCode.replace(
                                        cepPattern.Regex,
                                        cepPattern.Mask,
                                    )}{' '}
                                </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Data: </HelpSubTitle>
                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {activeHelpDate.date && format(new Date(activeHelpDate.date), 'dd/MM/yyyy')} às{' '}
                                    {String(activeHelpDate.date).substr(11, 5)} horas.
                                </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Necessitado: </HelpSubTitle>
                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {activeHelpDate.help.needy.showContact ? (
                                        <>
                                            {activeHelpDate.help.needy.name} {'\n'}Telefone: (
                                            {activeHelpDate.help.needy.ddd}){' '}
                                            {activeHelpDate.help.needy.phoneNumber} {'\n'}
                                            E-mail: {activeHelpDate.help.needy.email}
                                        </>
                                    ) : (
                                        <Text>Entrar em contato com organizador</Text>
                                    )}
                                </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Organizador: </HelpSubTitle>
                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {activeHelpDate.help.userManager.name} {'\n'}Telefone: (
                                    {activeHelpDate.help.userManager.ddd}){' '}
                                    {activeHelpDate.help.userManager.phoneNumber} {'\n'}E-mail:{' '}
                                    {activeHelpDate.help.userManager.email}
                                </HelpDescription>
                            </View>
                        </ScrollView>

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="CONFIRMAR"
                            titleForwardButton="next"
                            backFunction={() => setFormStage('2')}
                            forwardFunction={handleSetVolunteerToHelp}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default NewHelp;
