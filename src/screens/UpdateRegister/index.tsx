import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

import { UserData, FirstFormUpdateData, SecondFormData, AddressFromURL } from '../../utils/Interfaces';
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
} from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

const UpdateRegister: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [updatedUser, setUpdatedUser] = useState({} as UserData);
    const [formStage, setFormStage] = useState<'1' | '2'>('1');
    // PRIMEIRO FORM
    const firstFormRef = useRef<FormHandles>(null);
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const cpfRef = useRef<TextInput>(null);
    const phoneNumberRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
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
        async (data: FirstFormUpdateData) => {
            try {
                console.log('dados chegando: ', data);
                firstFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string().email('Digite um email válido').required('Email obrigatório'),
                    phoneNumber: Yup.string()
                        .min(10, 'Telefone muito pequeno')
                        .max(11, 'Telefone excede máximo')
                        .required('Telefone obrigatório e com DDD'),
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

                setUpdatedUser({
                    ...updatedUser,
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
        [updatedUser],
    );

    const handleUpdateUser = useCallback(async () => {
        try {
        } catch (e) {
            console.log(e.response.data);
            if (e && e.response && e.response.data) {
                Alert.alert(e.response.data);
            }
            Alert.alert('Erro no cadastro');
        }
    }, [updatedUser, navigation]);

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

                setUpdatedUser({
                    ...updatedUser,
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressState: data.addressState,
                    addressCity: data.addressCity,
                    addressArea: data.addressArea,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                });

                const addressIdRaw = await api.post('address/add', {
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressNumber: data.addressNumber ? Number(data.addressNumber) : null,
                    addressComplement: data.addressComplement,
                    addressArea: data.addressArea,
                    addressCity: data.addressCity,
                    addressState: data.addressState,
                });

                await api.put('user', {
                    id: user.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    cpf: updatedUser.cpf,
                    password: updatedUser.password,
                    phoneNumber: updatedUser.phoneNumber,
                    address: addressIdRaw.data,
                });

                Alert.alert('Usuário alterado com sucesso!');
                navigation.navigate('Main');
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
                Alert.alert('Erro na atualização', 'Cheque as credenciais');
            }
        },
        [updatedUser, navigation],
    );

    // useEffect(() => {
    //     let mounted = true;

    //     if (firstFormRef.current) {
    //         if (formStage === '1') {
    //             if (mounted) {
    //                 firstFormRef.current.setData({
    //                     ...updatedUser,
    //                     repeatPassword: updatedUser.password,
    //                 });
    //             }
    //         }
    //     }

    //     if (secondFormRef.current) {
    //         if (formStage === '2') {
    //             if (mounted) {
    //                 secondFormRef.current.setData({
    //                     ...updatedUser,
    //                 });
    //             }
    //         }
    //     }

    //     return () => {
    //         mounted = false;
    //     };
    // }, [formStage]);

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
                                    Cadastro {formStage === '2' && <BoldText> Endereço</BoldText>}
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/2 </StageText>
                        </HeaderNavigatorContainer>

                        <Form
                            initialData={user}
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
                                <Input
                                    ref={fullNameRef}
                                    labelName="NOME"
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
                                    labelName="E-MAIL"
                                    name="email"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        phoneNumberRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={phoneNumberRef}
                                    maxLength={11}
                                    labelName="TELEFONE"
                                    name="phoneNumber"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        passwordRef.current?.focus();
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
                                    onPress={() => navigation.navigate('Menu')}
                                />
                                <Button
                                    title="next"
                                    width={65}
                                    buttonText="CONFIRMAR"
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
                                    Cadastro {formStage === '2' && <BoldText>Endereço</BoldText>}
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/2 </StageText>
                        </HeaderNavigatorContainer>

                        <Form
                            initialData={user}
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
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
                                    labelName="RUA"
                                    autoCapitalize="words"
                                    name="addressStreet"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressNumberRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={addressNumberRef}
                                    labelName="NÚMERO"
                                    name="addressNumber"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressComplementRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={addressComplementRef}
                                    labelName="COMPLEMENTO"
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
                                    labelName="BAIRRO"
                                    name="addressArea"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressCityRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={addressCityRef}
                                    labelName="CIDADE"
                                    name="addressCity"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        addressStateRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={addressStateRef}
                                    labelName="ESTADO"
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
                                    buttonText="CONFIRMAR"
                                    buttonType="enter"
                                    onPress={() => secondFormRef.current?.submitForm()}
                                />
                            </View>
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default UpdateRegister;
