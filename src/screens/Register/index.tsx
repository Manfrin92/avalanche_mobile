import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    NativeModules,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

import { UserData, FirstFormData, SecondFormData } from '../../utils/Interfaces';
import { testCPF } from '../../utils/AppUtil';

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

const Register: React.FC = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({} as UserData);
    const [fullName, setFullName] = useState('');
    const [cooker, setCooker] = useState(false);
    const [driver, setDriver] = useState(false);
    const [doctor, setDoctor] = useState(false);
    const [nurse, setNurse] = useState(false);
    const [generalWorker, setGeneralWorker] = useState(false);
    const [hospitalCompanion, setHospitalCompanion] = useState(false);
    const [financialHelper, setFinancialHelper] = useState(false);
    const [interceptor, setInterceptor] = useState(false);
    const [manualWorker, setManualWorker] = useState(false);
    const [carpinter, setCarpinter] = useState(false);
    const [formStage, setFormStage] = useState<'1' | '2' | '3'>('1');
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const cpfRef = useRef<TextInput>(null);
    const phoneNumberRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const repeatPasswordRef = useRef<TextInput>(null);

    const firstFormRef = useRef<FormHandles>(null);

    const handleFirstForm = useCallback(
        async (data: FirstFormData) => {
            console.log('dados vindo: ', data);
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
                    return;
                }

                console.log(e);

                Alert.alert('Erro na autenticação', 'Cheque as credenciais');
            }
        },
        [user],
    );

    useEffect(() => {
        let mounted = true;

        if (firstFormRef.current) {
            if (formStage === '1') {
                if (mounted) {
                    console.log('user: ', user);
                    firstFormRef.current.setData({
                        ...user,
                        repeatPassword: user.password,
                    });
                }
            }
        }

        return () => {
            mounted = false;
        };
    }, [formStage]);

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
                                    {formStage === '3' && <BoldText>Habilidades</BoldText>}
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/3 </StageText>
                        </HeaderNavigatorContainer>

                        <Form
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                        >
                            <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                                <Input
                                    ref={fullNameRef}
                                    autoCapitalize="words"
                                    placeholderTextColor="#DA4453"
                                    placeholder="NOME"
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
                                    placeholderTextColor="#DA4453"
                                    placeholder="E-MAIL"
                                    name="email"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        cpfRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={cpfRef}
                                    maxLength={11}
                                    autoCapitalize="words"
                                    placeholderTextColor="#DA4453"
                                    placeholder="CPF"
                                    name="cpf"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        phoneNumberRef.current?.focus();
                                    }}
                                />

                                <Input
                                    ref={phoneNumberRef}
                                    maxLength={11}
                                    placeholderTextColor="#DA4453"
                                    placeholder="TELEFONE"
                                    name="phoneNumber"
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        passwordRef.current?.focus();
                                    }}
                                />
                                <Input
                                    secureTextEntry
                                    ref={passwordRef}
                                    placeholder="SENHA"
                                    name="password"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        repeatPasswordRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={repeatPasswordRef}
                                    secureTextEntry
                                    placeholder="REPITA A SENHA"
                                    name="repeatPassword"
                                    returnKeyType="next"
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
                                    {formStage === '3' && <BoldText>Habilidades</BoldText>}
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/3 </StageText>
                        </HeaderNavigatorContainer>

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    placeholderTextColor="#DA4453"
                                    placeholder="CEP"
                                    keyboardType="number-pad"
                                    onChangeText={(addressZipCode) => setUser({ ...user, addressZipCode })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="RUA"
                                    onChangeText={(addressStreet) => setUser({ ...user, addressStreet })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="NÚMERO"
                                    keyboardType="number-pad"
                                    onChangeText={(addressNumber) => setUser({ ...user, addressNumber })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="COMPLEMENTO"
                                    keyboardType="default"
                                    onChangeText={(addressComplement) => setUser({ ...user, addressComplement })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    secureTextEntry
                                    placeholderTextColor="#DA4453"
                                    placeholder="BAIRRO"
                                    onChangeText={(addressArea) => setUser({ ...user, addressArea })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    secureTextEntry
                                    placeholderTextColor="#DA4453"
                                    placeholder="CIDADE"
                                    onChangeText={(addressCity) => setUser({ ...user, addressCity })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    secureTextEntry
                                    placeholderTextColor="#DA4453"
                                    placeholder="ESTADO"
                                    onChangeText={(addressState) => setUser({ ...user, addressState })}
                                />
                            </InputContainer>
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
                                onPress={() => setFormStage('1')}
                            />
                            <Button
                                title="next"
                                width={65}
                                buttonText="CONFIRMAR"
                                buttonType="enter"
                                onPress={() => setFormStage('3')}
                            />
                        </View>
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
                                    Cadastro {formStage === '2' && <BoldText> Endereço</BoldText>}
                                    {formStage === '3' && <BoldText>Habilidades</BoldText>}
                                </NavigationText>
                            </View>
                            <StageText>{formStage}/3 </StageText>
                        </HeaderNavigatorContainer>

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <Selector
                                optionText="Cozinheiro (a)"
                                selected={cooker}
                                setSelected={() => setCooker(!cooker)}
                            />

                            <Selector
                                optionText="Motorista (a)"
                                selected={driver}
                                setSelected={() => setDriver(!driver)}
                            />
                            <Selector
                                optionText="Médico (a)"
                                selected={doctor}
                                setSelected={() => setDoctor(!doctor)}
                            />
                            <Selector
                                optionText="Enfermeiro (a)"
                                selected={nurse}
                                setSelected={() => setNurse(!nurse)}
                            />
                            <Selector
                                optionText="Serviços Gerais"
                                selected={generalWorker}
                                setSelected={() => setGeneralWorker(!generalWorker)}
                            />
                            <Selector
                                optionText="Acompanhante Hospitalar"
                                selected={hospitalCompanion}
                                setSelected={() => setHospitalCompanion(!hospitalCompanion)}
                            />
                            <Selector
                                optionText="Ajudante Financeiro"
                                selected={financialHelper}
                                setSelected={() => setFinancialHelper(!financialHelper)}
                            />
                            <Selector
                                optionText="Intercessor (a)"
                                selected={interceptor}
                                setSelected={() => setInterceptor(!interceptor)}
                            />
                            <Selector
                                optionText="Pedreiro (a)"
                                selected={manualWorker}
                                setSelected={() => setManualWorker(!manualWorker)}
                            />
                            <Selector
                                optionText="Carpinteiro (a)"
                                selected={carpinter}
                                setSelected={() => setCarpinter(!carpinter)}
                            />
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
                                onPress={() => console.log('ENVIAR CADASTRO')}
                            />
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default Register;
