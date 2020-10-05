import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

import { UserData, FirstFormData, SecondFormData, AddressFromURL } from '../../utils/Interfaces';
import { testCPF, getAddressByCep } from '../../utils/AppUtil';

import {
    Container,
    HeaderNavigatorContainer,
    NavigationText,
    StyledImage,
    StageText,
    BoldText,
    TextInput,
    InputContainer,
    TextTitle,
    DateContainer,
    DateText,
    DescriptionText,
} from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';

const NewHelp: React.FC = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({} as UserData);
    const [formStage, setFormStage] = useState<'1' | '2' | '3' | '4'>('4');
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

    const handleSearchAdressZipCode = useCallback(async (cep: string) => {
        if (cep === '' || cep.length < 8) {
            Alert.alert('Digite um cep valido.');
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
        async (data: FirstFormData) => {
            try {
                firstFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string().email('Digite um email válido').required('Email obrigatório'),
                    cpf: Yup.string().max(11, 'CPF mínimo 11 digitos').required('CPF obrigatório'),
                    phoneNumber: Yup.string()
                        .min(10, 'Telefone muito pequeno')
                        .max(11, 'Telefone excede máximo')
                        .required('Telefone obrigatório e com DDD'),
                    password: Yup.string().required('Senha obrigatória'),
                    repeatPassword: Yup.string()
                        .equals([Yup.ref('password')], 'Senhas não são iguais')
                        .required('Repita a senha'),
                });

                await schema.validate(data, { abortEarly: false });

                if (data) {
                    if (data.name) {
                        if (!data.name.split(' ')[1]) {
                            return Alert.alert('Sobrenome obrigatório!');
                        }
                    }
                    if (data.cpf) {
                        const validDelivererCPF = testCPF(data.cpf);

                        if (!validDelivererCPF) {
                            return Alert.alert('CPF inválido');
                        }
                    }
                }

                const alreadyCreatedUser = await api.post('/user/checkCpfEmail', {
                    cpf: data.cpf,
                    email: data.email,
                });

                if (alreadyCreatedUser.data) {
                    return Alert.alert('CPF ou E-mail já cadastrado.');
                }

                setUser({
                    ...user,
                    name: data.name,
                    email: data.email,
                    cpf: data.cpf,
                    phoneNumber: data.phoneNumber,
                    password: data.password,
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
        [user],
    );

    const handleSecondForm = useCallback(
        async (data: SecondFormData) => {
            try {
                secondFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    addressZipCode: Yup.string().required('CEP obrigatório'),
                    addressStreet: Yup.string().required('Digite uma cidade'),
                    addressState: Yup.string().required('Digite um estado'),
                    addressCity: Yup.string().required('Digite uma cidade'),
                    addressArea: Yup.string().required('Digite um bairro'),
                });

                await schema.validate(data, { abortEarly: false });

                setUser({
                    ...user,
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressState: data.addressState,
                    addressCity: data.addressCity,
                    addressArea: data.addressArea,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
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
        [user],
    );

    const handleCreateUser = useCallback(async () => {
        try {
            const addressIdRaw = await api.post('address/add', {
                addressZipCode: user.addressZipCode,
                addressStreet: user.addressStreet,
                addressNumber: user.addressNumber ? Number(user.addressNumber) : null,
                addressComplement: user.addressComplement,
                addressArea: user.addressArea,
                addressCity: user.addressCity,
                addressState: user.addressState,
            });

            await api.post('user/add', {
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                password: user.password,
                phoneNumber: user.phoneNumber,
                addressId: addressIdRaw.data,
            });

            Alert.alert('Usuário criado com sucesso!');
            navigation.navigate('Login');
        } catch (e) {
            console.log(e.response.data);
            if (e && e.response && e.response.data) {
                Alert.alert(e.response.data);
            }
            Alert.alert('Erro no cadastro');
        }
    }, [user, navigation]);

    return (
        <>
            {/* FIRST PART */}
            {formStage === '1' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HeaderNavigatorContainer>
                            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                                <StyledImage source={Logo} />
                                <NavigationText>
                                    Nova <BoldText>Ajuda</BoldText>
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/4 </StageText>
                        </HeaderNavigatorContainer>

                        <Form
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
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
                                    ref={descriptionRef}
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

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: '4%',
                                    marginTop: '1%',
                                    marginRight: '6%',
                                    marginLeft: '6%',
                                }}
                            >
                                <Button
                                    title="goBack"
                                    width={33}
                                    buttonText="VOLTAR"
                                    buttonType="goBack"
                                    onPress={() => navigation.navigate('LoginRegister')}
                                />
                                <Button
                                    title="next"
                                    width={65}
                                    buttonText="PRÓXIMO"
                                    buttonType="enter"
                                    onPress={() => firstFormRef.current?.submitForm()}
                                />
                            </View>
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART */}
            {formStage === '2' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HeaderNavigatorContainer>
                            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                                <StyledImage source={Logo} />
                                <NavigationText>
                                    Nova <BoldText>Ajuda</BoldText>
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/4 </StageText>
                        </HeaderNavigatorContainer>

                        <Form
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
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

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: '4%',
                                    marginTop: '1%',
                                    marginRight: '6%',
                                    marginLeft: '6%',
                                }}
                            >
                                <Button
                                    title="goBack"
                                    width={33}
                                    buttonText="VOLTAR"
                                    buttonType="goBack"
                                    onPress={() => setFormStage('1')}
                                />
                                <Button
                                    title="next"
                                    width={65}
                                    buttonText="PRÓXIMO"
                                    buttonType="enter"
                                    onPress={() => secondFormRef.current?.submitForm()}
                                />
                            </View>
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* THIRD PART */}
            {formStage === '3' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HeaderNavigatorContainer>
                            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                                <StyledImage source={Logo} />
                                <NavigationText>
                                    Nova <BoldText>Ajuda</BoldText>
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/4 </StageText>
                        </HeaderNavigatorContainer>

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <TextTitle>Datas:</TextTitle>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity>
                                    <DateContainer>
                                        <DateText>13/09</DateText>
                                        <DescriptionText>Acompanhamento Hospitalar</DescriptionText>
                                        <MaterialCommunityIcons
                                            style={{ marginLeft: '6%' }}
                                            name="pencil"
                                            size={38}
                                            color="#F6BB42"
                                        />
                                    </DateContainer>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: '4%',
                                marginTop: '2%',
                                marginRight: '6%',
                                marginLeft: '6%',
                            }}
                        >
                            <Button
                                title="goBack"
                                width={33}
                                buttonText="VOLTAR"
                                buttonType="goBack"
                                onPress={() => setFormStage('2')}
                            />
                            <Button
                                title="next"
                                width={65}
                                buttonText={formStage !== '3' ? 'PRÓXIMO' : 'CADASTRAR'}
                                buttonType="enter"
                                onPress={() => handleCreateUser()}
                            />
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* FOURTH PART */}
            {formStage === '4' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HeaderNavigatorContainer>
                            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                                <StyledImage source={Logo} />
                                <NavigationText>
                                    Nova <BoldText>Data</BoldText>
                                </NavigationText>
                            </View>
                        </HeaderNavigatorContainer>

                        <ScrollView style={{ marginTop: '6%' }}>
                            <View>
                                <TextTitle>Componente de Data</TextTitle>
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: '6%', marginRight: '6%' }}>
                            <Ionicons name="md-trash" size={72} color="#F6BB42" />
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: '4%',
                                marginTop: '1%',
                                marginRight: '6%',
                                marginLeft: '6%',
                            }}
                        >
                            <Button
                                title="goBack"
                                width={33}
                                buttonText="VOLTAR"
                                buttonType="goBack"
                                onPress={() => setFormStage('3')}
                            />
                            <Button
                                title="next"
                                width={65}
                                buttonText="ADICIONAR DATA"
                                buttonType="enter"
                                onPress={() => console.log('ok')}
                            />
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default NewHelp;
