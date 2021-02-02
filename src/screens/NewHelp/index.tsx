import React, { useState, useRef, useCallback } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import * as Yup from 'yup';
import { format } from 'date-fns-tz';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateSelector from '../../components/DateSelector';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';

import { HelpData, FirstFormHelpData, SecondFormHelpData } from '../../utils/Interfaces';
import { testCPF, getAddressByCep } from '../../utils/AppUtil';

import { TextTitle, DateContainer, DateText, DescriptionText } from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import HelpHeader from '../../components/HelpHeader';

const NewHelp: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [help, setHelp] = useState({} as HelpData);
    const [formStage, setFormStage] = useState<'1' | '2' | '3' | '4'>('1');
    // PRIMEIRO FORM
    const firstFormRef = useRef<FormHandles>(null);
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const observationRef = useRef<TextInput>(null);
    const repeatPasswordRef = useRef<TextInput>(null);
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
            setChosenDate(childChosenDate);
            help.helpDate = childChosenDate;
            setSelectedDate(true);
        },
        [help.helpDate],
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
                    email: Yup.string()
                        .email('Digite um email válido')
                        .required('Email do necessitado obrigatório'),
                    title: Yup.string().required('Título da ajuda obrigatório'),
                    description: Yup.string().required('Descrição obrigatória'),
                });

                await schema.validate(data, { abortEarly: false });

                setHelp({
                    ...help,
                    name: data.name,
                    email: data.email,
                    title: data.title,
                    description: data.description,
                    observation: data.observation ? data.observation : null,
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
            const addressIdRaw = await api.post('address/add', {
                addressZipCode: help.addressZipCode,
                addressStreet: help.addressStreet,
                addressNumber: help.addressNumber ? Number(help.addressNumber) : null,
                addressComplement: help.addressComplement,
                addressArea: help.addressArea,
                addressCity: help.addressCity,
                addressState: help.addressState,
            });

            const HelpIdRaw = await api.post('help/add', {
                ...help,
                address: addressIdRaw.data,
                userManager: user.id,
            });

            await api.post('helpDate/add', {
                ...help,
                userVolunteer: user.id,
                help: HelpIdRaw.data,
                date: chosenDate,
                type: 'ride',
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
    }, [help, navigation, user.id, chosenDate]);

    return (
        <>
            {/* FIRST PART */}
            {formStage === '1' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HelpHeader formCurrentStage={formStage} formTotalStages="4" />

                        <Form
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={help}
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
                                        titleRef.current?.focus();
                                    }}
                                />

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
                                        observationRef.current?.focus();
                                    }}
                                />

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
                        <HelpHeader formCurrentStage={formStage} formTotalStages="4" />

                        <Form
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={help}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
                                <TextTitle>Local das ajuda:</TextTitle>
                                <Input
                                    ref={addressZipCodeRef}
                                    maxLength={8}
                                    autoCapitalize="words"
                                    labelName="CEP"
                                    name="addressZipCode"
                                    keyboardType="number-pad"
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
                        <HelpHeader formCurrentStage={formStage} formTotalStages="4" />

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
                                            <DateText>
                                                {format(chosenDate, 'dd/MM', {
                                                    timeZone: 'America/Sao_Paulo',
                                                })}
                                            </DateText>
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
                        <HelpHeader isNewDate formCurrentStage={formStage} formTotalStages="4" />

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
                            forwardFunction={() => handleCreateHelp()}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default NewHelp;
