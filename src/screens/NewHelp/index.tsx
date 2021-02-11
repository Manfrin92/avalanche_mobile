import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Alert,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import * as Yup from 'yup';
import { getDate, getMonth, setMonth, format, setDate } from 'date-fns';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DateSelector from '../../components/DateSelector';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';

import { HelpData, FirstFormHelpData, SecondFormHelpData } from '../../utils/Interfaces';
import { getAddressByCep } from '../../utils/AppUtil';

import {
    TextTitle,
    DateContainer,
    DateText,
    DescriptionText,
    HelpTitle,
    HelpDescription,
    HelpSubTitle,
    Square,
    Text,
    styles,
    menuSelectedTextAvailable,
} from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import HelpHeader from '../../components/HelpHeader';
import helpImage from '../../../assets/helpImage.jpg';
import MaskedInput from '../../components/MaskedInput';
import { cepPattern, hourPattern } from '../../utils/RegexPatterns';

interface SkillType {
    id: string;
    name: string;
}

interface NeedyInCreation {
    name: string;
    email?: string;
    dddPhoneNumber?: string;
    phoneNumber?: string;
    showContact?: boolean;
}

const NewHelp: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [help, setHelp] = useState({} as HelpData);
    const [needyInCreation, setNeedyInCreation] = useState({} as NeedyInCreation);
    const [formStage, setFormStage] = useState<'1' | '2' | '3' | '4' | '5'>('1');
    // PRIMEIRO FORM
    const firstFormRef = useRef<FormHandles>(null);
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const dddPhoneRef = useRef<TextInput>(null);
    const needyPhoneRef = useRef<TextInput>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const dateHourRef = useRef<TextInput>(null);
    const observationRef = useRef<TextInput>(null);
    const [showContact, setShowContact] = useState(true);
    const [helpedDateTypes, setHelpedDateTypes] = useState<SkillType[]>();
    const [selectedHelpedDateType, setSelectedHelpedDateType] = useState<SkillType>();

    // SEGUNDO FORM
    const secondFormRef = useRef<FormHandles>(null);
    const addressZipCodeRef = useRef<TextInput>(null);
    const addressStreetRef = useRef<TextInput>(null);
    const addressNumberRef = useRef<TextInput>(null);
    const addressComplementRef = useRef<TextInput>(null);
    const addressAreaRef = useRef<TextInput>(null);
    const addressCityRef = useRef<TextInput>(null);
    const addressStateRef = useRef<TextInput>(null);
    // TERCEIRO FORM
    const today = new Date(Date.now());
    const [chosenDate, setChosenDate] = useState<Date>(today);
    const [selectedDate, setSelectedDate] = useState(false);

    const handleSetChosenDate = useCallback(
        (childChosenDate: Date) => {
            const newDate = new Date();
            const onlyDay = getDate(childChosenDate);
            const onlyMonth = getMonth(childChosenDate);
            const usingDay = setDate(newDate, onlyDay);
            const usingMonth = setMonth(usingDay, onlyMonth);

            const formatedFinalDate = `${format(usingMonth, 'yyyy-MM-dd')} ${help.dateHour}`;

            setChosenDate(childChosenDate);
            setHelp({ ...help, helpDate: formatedFinalDate });

            setSelectedDate(true);
        },
        [help],
    );

    const handleSearchAdressZipCode = useCallback(async (cep: string) => {
        if (cep === '' || cep.length < 8) {
            Alert.alert('Digite um cep válido.');
        }
        const completeAddress = await getAddressByCep(cep);

        if (completeAddress) {
            if (completeAddress.localidade) {
                secondFormRef.current?.setFieldValue('addressCity', completeAddress.localidade);
            }

            if (completeAddress.uf) {
                secondFormRef.current?.setFieldValue('addressState', completeAddress.uf);
            }

            if (completeAddress.logradouro) {
                secondFormRef.current?.setFieldValue('addressStreet', completeAddress.logradouro);
            }

            if (completeAddress.bairro) {
                secondFormRef.current?.setFieldValue('addressArea', completeAddress.bairro);
            }

            addressNumberRef.current?.focus();
        }
    }, []);

    const handleFirstForm = useCallback(
        async (data: FirstFormHelpData) => {
            try {
                firstFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome do necessitado obrigatório'),
                    title: Yup.string().required('Título da ajuda obrigatório'),
                    description: Yup.string().required('Descrição obrigatória'),
                    dateHour: Yup.string().required('Horário da ajuda obrigatória'),
                });

                await schema.validate(data, { abortEarly: false });

                if (
                    Number(data.dateHour.replace(/\D/g, '').substr(0, 2)) > 24 ||
                    Number(data.dateHour.replace(/\D/g, '').substr(2, 2)) < 0 ||
                    Number(data.dateHour.replace(/\D/g, '').substr(2, 2)) > 59
                ) {
                    return Alert.alert('O formato do horário deve estar dentro de 24 horas e 59 minutos.');
                }

                setHelp({
                    ...help,
                    title: data.title,
                    description: data.description,
                    observation: data.observation ? data.observation : null,
                    dateHour: `${data.dateHour}`,
                });

                setNeedyInCreation({
                    name: data.name,
                    email: data.email,
                    dddPhoneNumber: data.dddPhoneNumber,
                    phoneNumber: data.phoneNumber,
                });

                setFormStage('2');
            } catch (e) {
                if (e instanceof Yup.ValidationError) {
                    const errors = getValidationsErrors(e);
                    Object.entries(errors).forEach(([key, value]) => {
                        Alert.alert(value);
                    });
                    firstFormRef.current?.setErrors(errors);
                    console.log(e);
                    return;
                }

                console.log(e);

                Alert.alert('Erro na autenticação', 'Cheque as credenciais');
            }
        },
        [help],
    );

    const handleSecondForm = useCallback(
        async (data: SecondFormHelpData) => {
            try {
                secondFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    addressZipCode: Yup.string().required('CEP obrigatório'),
                    addressStreet: Yup.string().max(70, 'Tamanho rua excede máximo').required('Digite uma rua'),
                    addressComplement: Yup.string().max(100, 'Tamanho complemento excede máximo'),
                    addressState: Yup.string().max(2, 'Tamanho estado excede máximo').required('Digite um estado'),
                    addressCity: Yup.string()
                        .max(60, 'Tamanho cidade excede máximo')
                        .required('Digite uma cidade'),
                    addressArea: Yup.string().max(60, 'Tamanho bairro excede máximo').required('Digite um bairro'),
                });

                await schema.validate(data, { abortEarly: false });

                setHelp({
                    ...help,
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressState: data.addressState,
                    addressCity: data.addressCity,
                    addressArea: data.addressArea,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                    addressCountry: 'Brasil',
                });

                setFormStage('3');
            } catch (e) {
                if (e instanceof Yup.ValidationError) {
                    const errors = getValidationsErrors(e);
                    Object.entries(errors).forEach(([key, value]) => {
                        Alert.alert(value);
                    });
                    secondFormRef.current?.setErrors(errors);
                    return;
                }
                console.log(e);
                Alert.alert('Erro na autenticação', 'Cheque as credenciais');
            }
        },
        [help],
    );

    const handleCreateHelp = useCallback(async () => {
        try {
            await api.post('help/add', {
                ...help,
                ...needyInCreation,
                helpDate: help.helpDate.substr(0, 19),
                addressZipCode: help.addressZipCode.replace(/\D/g, ''),
                userManager: user.id,
                dateHour: `${help.dateHour}:00`,
                phoneNumber: needyInCreation.phoneNumber ? needyInCreation.phoneNumber.replace(/\D/g, '') : null,
            });

            Alert.alert('Ajuda cadastrada com sucesso!');
            navigation.navigate(ScreenNamesEnum.Main);
        } catch (e) {
            console.log(e.response.data);
            if (e && e.response && e.response.data) {
                Alert.alert(e.response.data);
            }
            Alert.alert('Erro no cadastro');
        }
    }, [help, navigation, user.id, needyInCreation]);

    useEffect(() => {
        let mounted = true;

        async function getHelpTypes(): Promise<void> {
            await api
                .get('type/helpedDate')
                .then((response) => {
                    if (mounted) {
                        setHelpedDateTypes(response.data);
                        setSelectedHelpedDateType(response.data[0]);
                        setHelp({
                            ...help,
                            helpedDateTypeId: help.helpedDateTypeId ? help.helpedDateTypeId : response.data[0].id,
                        });
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

    useEffect(() => {
        if (formStage === '1') {
            if (needyInCreation && needyInCreation.phoneNumber) {
                if (firstFormRef && firstFormRef.current) {
                    firstFormRef.current.setData({
                        ...needyInCreation,
                        ...help,
                        phoneNumber: needyInCreation.phoneNumber,
                    });
                }
            }
            if (help && help.dateHour) {
                if (firstFormRef && firstFormRef.current) {
                    firstFormRef.current.setData({
                        ...needyInCreation,
                        ...help,
                        dateHour: help.dateHour.replace(hourPattern.Regex, hourPattern.Mask),
                    });
                }
            }
        } else if (formStage === '2') {
            if (help && help.addressZipCode) {
                if (secondFormRef && secondFormRef.current) {
                    secondFormRef.current.setData({
                        ...needyInCreation,
                        ...help,
                        addressZipCode: help.addressZipCode.replace(cepPattern.Regex, cepPattern.Mask),
                    });
                }
            }
        }
    }, [formStage]);

    return (
        <>
            {/* FIRST PART */}
            {formStage === '1' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader formCurrentStage={formStage} formTotalStages="5" />

                        <Form
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={{ ...help, ...needyInCreation }}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
                                <TextTitle>Quem receberá a ajuda:</TextTitle>

                                <Input
                                    ref={fullNameRef}
                                    labelName="Nome"
                                    autoCapitalize="words"
                                    name="name"
                                    keyboardType="default"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        emailRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={emailRef}
                                    autoCapitalize="none"
                                    labelName="E-mail"
                                    name="email"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        dddPhoneRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={dddPhoneRef}
                                    labelName="DDD"
                                    name="dddPhoneNumber"
                                    maxLength={2}
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        needyPhoneRef.current?.focus();
                                    }}
                                />

                                <MaskedInput
                                    maskName="phone"
                                    ref={needyPhoneRef}
                                    maxLength={10}
                                    keyboardType="number-pad"
                                    name="phoneNumber"
                                    labelName="Telefone"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        titleRef.current?.focus();
                                    }}
                                />

                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: '6%',
                                        marginTop: '3%',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        setNeedyInCreation({ ...needyInCreation, showContact: !showContact });
                                        setShowContact(!showContact);
                                    }}
                                >
                                    <Square isAccepted={showContact}>
                                        {showContact && (
                                            <MaterialCommunityIcons name="check-bold" size={18} color="#00A57C" />
                                        )}
                                    </Square>
                                    <Text style={{ marginLeft: '3%', fontSize: 16 }}>Exibir contato</Text>
                                </TouchableOpacity>

                                <TextTitle style={{ marginTop: '4%' }}>Informações sobre a ajuda:</TextTitle>
                                <Input
                                    ref={titleRef}
                                    autoCapitalize="words"
                                    labelName="Título"
                                    name="title"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        descriptionRef.current?.focus();
                                    }}
                                />

                                <Input
                                    numberOfLines={5}
                                    multiline
                                    ref={descriptionRef}
                                    height={400}
                                    labelName="Descrição"
                                    name="description"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        dateHourRef.current?.focus();
                                    }}
                                />

                                <MaskedInput
                                    maskName="hourPattern"
                                    ref={dateHourRef}
                                    maxLength={5}
                                    keyboardType="number-pad"
                                    name="dateHour"
                                    labelName="Horário da ajuda ex: 15:30"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        observationRef.current?.focus();
                                    }}
                                />

                                <Text style={{ marginLeft: '6%' }}>Selecione o tipo da ajuda</Text>

                                {selectedHelpedDateType && helpedDateTypes && (
                                    <Menu style={styles.menuContainer}>
                                        <MenuTrigger
                                            customStyles={menuSelectedTextAvailable}
                                            text={selectedHelpedDateType.name}
                                        />

                                        <MenuOptions
                                            customStyles={{
                                                optionsContainer: styles.menuWrapper,
                                            }}
                                        >
                                            {helpedDateTypes.map((helpedDateType) => (
                                                <MenuOption
                                                    key={helpedDateType.id}
                                                    style={styles.menuOption}
                                                    onSelect={() => {
                                                        setHelp({ ...help, helpedDateTypeId: helpedDateType.id });
                                                        setSelectedHelpedDateType(helpedDateType);
                                                    }}
                                                >
                                                    <Text>{helpedDateType.name}</Text>
                                                </MenuOption>
                                            ))}
                                        </MenuOptions>
                                    </Menu>
                                )}

                                <Input
                                    ref={observationRef}
                                    labelName="Observações"
                                    name="observation"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        firstFormRef.current?.submitForm();
                                    }}
                                />
                            </ScrollView>

                            <RegisterFooterButtons
                                textBackButton="VOLTAR"
                                titleBackButton="goBack"
                                textForwardButton="PRÓXIMO"
                                titleForwardButton="next"
                                backFunction={() => navigation.navigate(ScreenNamesEnum.Main)}
                                forwardFunction={() => firstFormRef.current?.submitForm()}
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART */}
            {formStage === '2' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader formCurrentStage={formStage} formTotalStages="5" />

                        <Form
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={help}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
                                <TextTitle>Local das ajuda:</TextTitle>

                                <MaskedInput
                                    maskName="cep"
                                    ref={addressZipCodeRef}
                                    maxLength={10}
                                    keyboardType="number-pad"
                                    name="addressZipCode"
                                    labelName="CEP"
                                    returnKeyType="next"
                                    onEndEditing={(e) => {
                                        handleSearchAdressZipCode(e.nativeEvent.text.replace(/\D/g, ''));
                                    }}
                                    cepIcon
                                    getCep={(e: any) =>
                                        handleSearchAdressZipCode(e.nativeEvent.text.replace(/\D/g, ''))
                                    }
                                />

                                <Input
                                    ref={addressStreetRef}
                                    labelName="Rua"
                                    autoCapitalize="words"
                                    name="addressStreet"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressNumberRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={addressNumberRef}
                                    labelName="Número"
                                    name="addressNumber"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressComplementRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={addressComplementRef}
                                    labelName="Complemento"
                                    autoCapitalize="words"
                                    name="addressComplement"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressAreaRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={addressAreaRef}
                                    autoCapitalize="words"
                                    labelName="Bairro"
                                    name="addressArea"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressCityRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={addressCityRef}
                                    labelName="Cidade"
                                    name="addressCity"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressStateRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={addressStateRef}
                                    labelName="Estado"
                                    name="addressState"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        secondFormRef.current?.submitForm();
                                    }}
                                />
                            </ScrollView>

                            <RegisterFooterButtons
                                textBackButton="VOLTAR"
                                titleBackButton="goBack"
                                textForwardButton="PRÓXIMO"
                                titleForwardButton="next"
                                backFunction={() => setFormStage('1')}
                                forwardFunction={() => secondFormRef.current?.submitForm()}
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* THIRD PART */}
            {formStage === '3' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader formCurrentStage={formStage} formTotalStages="5" />

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <TextTitle style={{ marginLeft: '0%' }}>Datas:</TextTitle>

                            {selectedDate && (
                                <View>
                                    <TouchableOpacity>
                                        <DateContainer
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <DateText>{format(chosenDate, 'dd/MM')}</DateText>
                                            <DescriptionText>{help.title}</DescriptionText>
                                            <MaterialCommunityIcons
                                                style={{ marginLeft: '6%' }}
                                                name="pencil"
                                                size={38}
                                                color="#F6BB42"
                                            />
                                        </DateContainer>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="PRÓXIMO"
                            titleForwardButton="next"
                            backFunction={() => setFormStage('2')}
                            forwardFunction={() => setFormStage('4')}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* FOURTH PART */}
            {formStage === '4' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader isNewDate formCurrentStage={formStage} formTotalStages="5" />

                        <ScrollView style={{ marginTop: '6%' }}>
                            <View>
                                <DateSelector setChosenDate={handleSetChosenDate} />
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: '6%', marginRight: '6%' }}>
                            <Ionicons name="md-trash" size={72} color="#F6BB42" />
                        </TouchableOpacity>

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="PRÓXIMO"
                            titleForwardButton="next"
                            backFunction={() => setFormStage('3')}
                            forwardFunction={() => setFormStage('5')}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* FIFTH PART */}
            {formStage === '5' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader isNewDate formCurrentStage={formStage} formTotalStages="5" />

                        <ScrollView style={{ marginTop: '6%' }}>
                            <HelpTitle style={{ marginLeft: '3%' }}>Ajuda para {needyInCreation.name}</HelpTitle>
                            <Image
                                style={{ width: 350, height: 200, alignSelf: 'center', marginTop: '3%' }}
                                source={helpImage}
                            />
                            <View style={{ margin: '3%' }}>
                                <HelpSubTitle>Título: {help.title}</HelpSubTitle>

                                <HelpDescription>{help.description} </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Local: </HelpSubTitle>

                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {help.addressStreet} {help.addressNumber}, {help.addressArea},{' '}
                                    {help.addressCity} {help.addressState}{' '}
                                </HelpDescription>
                                <HelpDescription>CEP: {help.addressZipCode} </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Data: </HelpSubTitle>
                                <HelpDescription style={{ marginTop: '3%' }}>
                                    {format(chosenDate, 'dd/MM/yyyy')} às {help.dateHour.substr(0, 5)} horas.
                                </HelpDescription>

                                <HelpSubTitle style={{ marginTop: '3%' }}>Organizador: </HelpSubTitle>
                                <HelpDescription style={{ marginTop: '3%' }}>{user.name} </HelpDescription>
                            </View>
                        </ScrollView>

                        <RegisterFooterButtons
                            textBackButton="VOLTAR"
                            titleBackButton="goBack"
                            textForwardButton="PUBLICAR"
                            titleForwardButton="next"
                            backFunction={() => setFormStage('4')}
                            forwardFunction={() => handleCreateHelp()}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default NewHelp;
