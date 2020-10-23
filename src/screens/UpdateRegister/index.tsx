import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { AntDesign, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

import { UserData, FirstFormUpdateData, SecondFormData, AddressFromURL, Address } from '../../utils/Interfaces';
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
import { ScreenNamesEnum } from '../../utils/enums';
import Loading from '../Loading';

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
                    phoneNumber: data.phoneNumber,
                });

                setData({
                    token,
                    user: {
                        ...user,
                        name: data.name,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                    },
                });

                setUpdatedUser({
                    ...updatedUser,
                    name: data.name,
                    email: data.email,
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
        [updatedUser, user.id],
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
        [updatedUser, user.id],
    );

    useEffect(() => {
        let mounted = true;
        async function getAddress(): Promise<void> {
            try {
                const receivedRawAddress = await api.post('/address/getAddressById', {
                    id: user.address,
                });
                if (receivedRawAddress && receivedRawAddress.data) {
                    if (mounted) {
                        setUserAddress({
                            ...receivedRawAddress.data,
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
                Alert.alert('Erro ao buscar dados do endereço');
            }
            setLoading(false);
        }

        getAddress();

        return () => {
            mounted = false;
        };
    }, [user.address, updatedUser]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {selecting && (
                <SafeAreaView style={{ flex: 1 }}>
                    <HeaderNavigatorContainer>
                        <View style={{ flexDirection: 'row', marginLeft: 19, justifyContent: 'space-between' }}>
                            <StyledImage source={Logo} />
                            <NavigationText>Alteração de Cadastro</NavigationText>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(ScreenNamesEnum.Menu);
                                }}
                                style={{ marginLeft: '36%' }}
                            >
                                <AntDesign name="arrowleft" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </HeaderNavigatorContainer>
                    <View style={{ marginTop: '10%', marginLeft: '10%' }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                                setFormStage('1');
                                setSelecting(false);
                            }}
                        >
                            <MaterialCommunityIcons
                                style={{ width: 32, marginLeft: 1 }}
                                name="face-profile"
                                size={32}
                                color="#434A54"
                            />
                            <NavigationText style={{ marginLeft: '2.5%' }}>Dados pessoais</NavigationText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', marginTop: '6%' }}
                            onPress={() => {
                                setFormStage('2');
                                setSelecting(false);
                            }}
                        >
                            <FontAwesome5
                                style={{ width: 32, marginLeft: 4 }}
                                name="map-marker-alt"
                                size={32}
                                color="#434A54"
                            />
                            <NavigationText style={{ marginLeft: '2%' }}>Endereço</NavigationText>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}

            {/* FIRST PART PERSONAL DATA */}
            {formStage === '1' && !selecting && (
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
                                    onPress={() => {
                                        setSelecting(true);
                                    }}
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

            {/* SECOND PART ADDRESS */}
            {formStage === '2' && !selecting && (
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
                            initialData={userAddress}
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
                                    onPress={() => setSelecting(true)}
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
