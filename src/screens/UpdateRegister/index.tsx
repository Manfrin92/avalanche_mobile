import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import { UserData, FirstFormUpdateData, SecondFormData, Address } from '../../utils/Interfaces';
import { testCPF, getAddressByCep } from '../../utils/AppUtil';

import { OptionsContainer } from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import Loading from '../Loading';
import UpdateRegisterHeader from '../../components/UpdateRegisterHeader';
import UpdateOption from '../../components/UpdateOption';
import UpdateRegisterOptionHeader from '../../components/UpdateRegisterOptionHeader';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';
import MaskedInput from '../../components/MaskedInput';
import { cepPattern, phonePattern } from '../../utils/RegexPatterns';

const UpdateRegister: React.FC = () => {
    const [selecting, setSelecting] = useState(true);
    const [userAddress, setUserAddress] = useState({} as Address);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user, setData, token } = useAuth();
    const [updatedUser, setUpdatedUser] = useState({} as UserData);
    const [formStage, setFormStage] = useState<'1' | '2'>('1');
    // PRIMEIRO FORM
    const firstFormRef = useRef<FormHandles>(null);
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const cpfRef = useRef<TextInput>(null);
    const dddRef = useRef<TextInput>(null);
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
                setLoading(true);
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

                await api.put('/user', {
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    ddd: data.ddd,
                    phoneNumber: data.phoneNumber,
                });

                setData({
                    token,
                    user: {
                        ...user,
                        name: data.name,
                        email: data.email,
                        ddd: data.ddd,
                        phoneNumber: data.phoneNumber,
                    },
                });

                setUpdatedUser({
                    ...updatedUser,
                    name: data.name,
                    email: data.email,
                    ddd: data.ddd,
                    phoneNumber: data.phoneNumber,
                });

                Alert.alert('Dados pessoais atualizados com sucesso');

                setLoading(false);

                setSelecting(true);
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
                setLoading(false);
                Alert.alert('Erro na autenticação', 'Cheque as credenciais');
            }
        },
        [updatedUser, user, setData, token],
    );

    const handleSecondForm = useCallback(
        async (data: SecondFormData) => {
            try {
                setLoading(true);
                secondFormRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    addressZipCode: Yup.string().required('CEP obrigatório'),
                    addressStreet: Yup.string().required('Digite uma cidade'),
                    addressState: Yup.string().required('Digite um estado'),
                    addressCity: Yup.string().required('Digite uma cidade'),
                    addressArea: Yup.string().required('Digite um bairro'),
                });

                await schema.validate(data, { abortEarly: false });

                const addressIdRaw = await api.post('address', {
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

                await api.post('/address', {
                    id: user.address,
                });

                setData({
                    token,
                    user: {
                        ...user,
                        address: addressIdRaw.data,
                    },
                });

                setUpdatedUser({
                    ...updatedUser,
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressState: data.addressState,
                    addressCity: data.addressCity,
                    addressArea: data.addressArea,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                    address: addressIdRaw.data,
                });

                setUserAddress({
                    ...userAddress,
                    addressZipCode: data.addressZipCode,
                    addressStreet: data.addressStreet,
                    addressState: data.addressState,
                    addressCity: data.addressCity,
                    addressArea: data.addressArea,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                });

                Alert.alert('Endereço atualizado com sucesso!');
                setLoading(false);
                setSelecting(true);
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
                setLoading(false);
                Alert.alert('Erro na atualização', 'Cheque as credenciais');
            }
        },
        [updatedUser, user, setData, token, userAddress],
    );

    useEffect(() => {
        let mounted = true;
        async function getAddress(): Promise<void> {
            try {
                const receivedRawAddress = await api.get(`/address/${user.address.id}`);
                if (receivedRawAddress && receivedRawAddress.data) {
                    if (mounted) {
                        setUserAddress({
                            ...receivedRawAddress.data,
                            phoneNumber:
                                receivedRawAddress.data && receivedRawAddress.data.phoneNumber
                                    ? receivedRawAddress.data.phoneNumber.replace(
                                          phonePattern.Regex,
                                          phonePattern.Mask,
                                      )
                                    : '',
                            addressNumber: receivedRawAddress.data.addressNumber
                                ? `${receivedRawAddress.data.addressNumber}`
                                : '',
                            addressComplement: receivedRawAddress.data.addressComplement
                                ? `${receivedRawAddress.data.addressComplement}`
                                : '',
                        });
                        setLoading(false);
                    }
                }
            } catch (e) {
                console.log(e);
                setLoading(false);
                Alert.alert('Erro', 'Erro ao buscar dados do endereço');
            }
            setLoading(false);
        }

        getAddress();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (formStage === '2' && secondFormRef && secondFormRef.current) {
            secondFormRef.current.setData({
                addressZipCode: user.address.addressZipCode.replace(cepPattern.Regex, cepPattern.Mask),
            });
        }
    }, [formStage]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {selecting && (
                <SafeAreaView style={{ flex: 1 }}>
                    <UpdateRegisterHeader
                        navigateToMenu={() => {
                            navigation.navigate(ScreenNamesEnum.Menu);
                        }}
                    />

                    <OptionsContainer>
                        <UpdateOption
                            optionText="Dados pessoais"
                            setFormStage={() => setFormStage('1')}
                            setSelecting={() => setSelecting(false)}
                        >
                            <MaterialCommunityIcons
                                style={{ width: 32, marginLeft: 1 }}
                                name="face-profile"
                                size={32}
                                color="#434A54"
                            />
                        </UpdateOption>

                        <UpdateOption
                            optionText="Endereço"
                            setFormStage={() => setFormStage('2')}
                            setSelecting={() => setSelecting(false)}
                        >
                            <FontAwesome5
                                style={{ width: 32, marginLeft: 4 }}
                                name="map-marker-alt"
                                size={32}
                                color="#434A54"
                            />
                        </UpdateOption>
                    </OptionsContainer>
                </SafeAreaView>
            )}

            {/* FIRST PART PERSONAL DATA */}
            {formStage === '1' && !selecting && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <UpdateRegisterOptionHeader formStage={formStage} />

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
                                        dddRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={dddRef}
                                    maxLength={2}
                                    labelName="DDD"
                                    name="ddd"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        phoneNumberRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={phoneNumberRef}
                                    maxLength={11}
                                    keyboardType="number-pad"
                                    name="phoneNumber"
                                    labelName="Telefone"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        passwordRef.current?.focus();
                                    }}
                                />
                            </ScrollView>

                            <RegisterFooterButtons
                                backFunction={() => setSelecting(true)}
                                forwardFunction={() => firstFormRef.current?.submitForm()}
                                textForwardButton="CONFIRMAR"
                                textBackButton="VOLTAR"
                                titleBackButton="goBack"
                                titleForwardButton="next"
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART ADDRESS */}
            {formStage === '2' && !selecting && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <UpdateRegisterOptionHeader formStage={formStage} />

                        <Form
                            initialData={userAddress}
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
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

                                {/* <Input
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
                                /> */}
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

                            <RegisterFooterButtons
                                backFunction={() => setSelecting(true)}
                                forwardFunction={() => secondFormRef.current?.submitForm()}
                                textForwardButton="CONFIRMAR"
                                textBackButton="VOLTAR"
                                titleBackButton="goBack"
                                titleForwardButton="next"
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default UpdateRegister;
