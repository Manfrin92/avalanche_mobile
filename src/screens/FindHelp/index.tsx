import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Alert,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { getDate, getMonth, setMonth, format, setDate } from 'date-fns';

import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import DateSelector from '../../components/DateSelector';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';

import { DateContainer, DateText, menuSelectedTextAvailable, styles, Text, TextTitle } from './styles';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import HelpHeader from '../../components/HelpHeader';
import helpImage from '../../../assets/helpImage.jpg';
import Loading from '../Loading';
import Button from '../../components/Button';

interface HelpDateType {
    id: string;
    name: string;
    groupName: string;
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

    const handleSetInitialDate = useCallback((childChosenDate: Date) => {
        const newDate = new Date();
        const onlyDay = getDate(childChosenDate);
        const onlyMonth = getMonth(childChosenDate);
        const usingDay = setDate(newDate, onlyDay);
        const usingMonth = setMonth(usingDay, onlyMonth);

        const formatedFinalDate = `${format(usingMonth, 'yyyy-MM-dd')}`;

        console.log('formated: ', formatedFinalDate);

        // setChosenDate(childChosenDate);
        // setHelp({ ...help, helpDate: formatedFinalDate });

        // setSelectedDate(true);
    }, []);

    const handleSetFinalDate = useCallback((childChosenDate: Date) => {
        const newDate = new Date();
        const onlyDay = getDate(childChosenDate);
        const onlyMonth = getMonth(childChosenDate);
        const usingDay = setDate(newDate, onlyDay);
        const usingMonth = setMonth(usingDay, onlyMonth);

        const formatedFinalDate = `${format(usingMonth, 'yyyy-MM-dd')}`;

        console.log('formated: ', formatedFinalDate);

        // setChosenDate(childChosenDate);
        // setHelp({ ...help, helpDate: formatedFinalDate });

        // setSelectedDate(true);
    }, []);

    const handleHelpSearch = useCallback(() => {
        try {
            console.log('dados até então: ', {
                initialDate,
                finalDate,
                helpDateType,
            });
        } catch (e) {
            Alert.alert('Erro', 'Erro ao buscar ajudas.');
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
                                    setChosenDate={handleSetInitialDate}
                                    initialDate={initialDate}
                                />
                            </View>
                            <View>
                                <DateSelector
                                    title="Data final"
                                    setChosenDate={handleSetFinalDate}
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
                        <HelpHeader isNewDate formCurrentStage={formStage} formTotalStages="3" />

                        <ScrollView style={{ marginTop: '6%' }} />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* THIRD PART */}
            {formStage === '3' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader isNewDate formCurrentStage={formStage} formTotalStages="3" />

                        <ScrollView style={{ marginTop: '6%' }} />

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="CONFIRMAR"
                            titleForwardButton="next"
                            backFunction={() => setFormStage('2')}
                            forwardFunction={() => console.log('ok')}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default NewHelp;
