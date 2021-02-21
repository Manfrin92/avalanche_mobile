import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Alert, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

import { UserData, FirstFormData, SecondFormData, AddressFromURL } from '../../utils/Interfaces';
import { testCPF, getAddressByCep } from '../../utils/AppUtil';

import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';
import { ScreenNamesEnum, SkillsEnum } from '../../utils/enums';
import RegisterHeader from '../../components/RegisterHeader';
import RegisterFooterButtons from '../../components/RegisterFooterButtons';
import MaskedInput from '../../components/MaskedInput';
import { cepPattern, cpfPattern } from '../../utils/RegexPatterns';

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
    // TERCEIRO FORM
    const [skills, setSkills] = useState<Array<string>>();

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

                console.log('cpf retornado: ', data);

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string().email('Digite um email válido').required('Email obrigatório'),
                    cpf: Yup.string().max(14, 'CPF mínimo 11 digitos').required('CPF obrigatório'),
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
                    ddd: data.ddd,
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
            await api.post('user', {
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                password: user.password,
                ddd: user.ddd,
                phoneNumber: user.phoneNumber,
                addressZipCode: user.addressZipCode,
                addressStreet: user.addressStreet,
                addressNumber: user.addressNumber ? Number(user.addressNumber) : null,
                addressComplement: user.addressComplement,
                addressArea: user.addressArea,
                addressCity: user.addressCity,
                addressState: user.addressState,
                skills,
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
    }, [user, navigation, skills]);

    useEffect(() => {
        let mounted = true;

        if (firstFormRef && firstFormRef.current) {
            if (formStage === '1') {
                if (mounted) {
                    firstFormRef.current.setData({
                        ...user,
                        cpf: user.cpf ? user.cpf.replace(cpfPattern.Regex, cpfPattern.Mask) : '',
                        repeatPassword: user.password,
                    });
                }
            }
        }

        if (secondFormRef && secondFormRef.current) {
            if (formStage === '2') {
                if (mounted) {
                    secondFormRef.current.setData({
                        ...user,
                        addressZipCode: user.addressZipCode
                            ? user.addressZipCode.replace(cepPattern.Regex, cepPattern.Mask)
                            : '',
                    });
                }
            }
        }

        return () => {
            mounted = false;
        };
    }, [formStage, user]);

    return (
        <>
            {/* FIRST PART */}
            {formStage === '1' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <RegisterHeader formStage={formStage} formLength="3" />

                        <Form
                            onSubmit={handleFirstForm}
                            ref={firstFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={user}
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
                                        cpfRef.current?.focus();
                                    }}
                                />

                                <MaskedInput
                                    maskName="cpf"
                                    ref={cpfRef}
                                    maxLength={14}
                                    autoCapitalize="words"
                                    labelName="CPF"
                                    name="cpf"
                                    keyboardType="number-pad"
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

                                <MaskedInput
                                    maskName="phone"
                                    ref={phoneNumberRef}
                                    maxLength={10}
                                    labelName="TELEFONE"
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
                                    labelName="SENHA"
                                    name="password"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        repeatPasswordRef.current?.focus();
                                    }}
                                />
                                <Input
                                    ref={repeatPasswordRef}
                                    secureTextEntry
                                    labelName="REPITA A SENHA"
                                    name="repeatPassword"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        firstFormRef.current?.submitForm();
                                    }}
                                />
                            </ScrollView>

                            <RegisterFooterButtons
                                forwardFunction={() => firstFormRef.current?.submitForm()}
                                titleBackButton="goBack"
                                textBackButton="VOLTAR"
                                titleForwardButton="next"
                                textForwardButton="CONFIRMAR"
                                backFunction={() => navigation.navigate(ScreenNamesEnum.LoginRegister)}
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART */}
            {formStage === '2' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <RegisterHeader formLength="3" formStage={formStage} />

                        <Form
                            onSubmit={handleSecondForm}
                            ref={secondFormRef}
                            style={{ flex: 1, justifyContent: 'flex-end' }}
                            initialData={user}
                        >
                            <ScrollView style={{ marginTop: '6%' }}>
                                <MaskedInput
                                    maskName="cep"
                                    ref={addressZipCodeRef}
                                    maxLength={10}
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

                            <RegisterFooterButtons
                                forwardFunction={() => secondFormRef.current?.submitForm()}
                                titleBackButton="goBack"
                                textBackButton="VOLTAR"
                                titleForwardButton="next"
                                textForwardButton="CONFIRMAR"
                                backFunction={() => setFormStage('1')}
                            />
                        </Form>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* THIRD PART */}
            {formStage === '3' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <RegisterHeader formStage={formStage} formLength="3" />

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <Selector
                                optionText="Cozinheiro (a)"
                                selected={cooker}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillCooker]);
                                    } else {
                                        setSkills([SkillsEnum.skillCooker]);
                                    }
                                    setCooker(!cooker);
                                }}
                            />

                            <Selector
                                optionText="Motorista (a)"
                                selected={driver}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillDriver]);
                                    } else {
                                        setSkills([SkillsEnum.skillDriver]);
                                    }
                                    setDriver(!driver);
                                }}
                            />
                            <Selector
                                optionText="Médico (a)"
                                selected={doctor}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillDoctor]);
                                    } else {
                                        setSkills([SkillsEnum.skillDoctor]);
                                    }
                                    setDoctor(!doctor);
                                }}
                            />
                            <Selector
                                optionText="Enfermeiro (a)"
                                selected={nurse}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillNurse]);
                                    } else {
                                        setSkills([SkillsEnum.skillNurse]);
                                    }
                                    setNurse(!nurse);
                                }}
                            />
                            <Selector
                                optionText="Serviços Gerais"
                                selected={generalWorker}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillGeneralServices]);
                                    } else {
                                        setSkills([SkillsEnum.skillGeneralServices]);
                                    }
                                    setGeneralWorker(!generalWorker);
                                }}
                            />
                            <Selector
                                optionText="Acompanhante Hospitalar"
                                selected={hospitalCompanion}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillHospitalPartner]);
                                    } else {
                                        setSkills([SkillsEnum.skillHospitalPartner]);
                                    }
                                    setHospitalCompanion(!hospitalCompanion);
                                }}
                            />
                            <Selector
                                optionText="Ajudante Financeiro"
                                selected={financialHelper}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillFinancialHelper]);
                                    } else {
                                        setSkills([SkillsEnum.skillFinancialHelper]);
                                    }
                                    setFinancialHelper(!financialHelper);
                                }}
                            />

                            <Selector
                                optionText="Pedreiro (a)"
                                selected={manualWorker}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillMason]);
                                    } else {
                                        setSkills([SkillsEnum.skillMason]);
                                    }
                                    setManualWorker(!manualWorker);
                                }}
                            />
                            <Selector
                                optionText="Carpinteiro (a)"
                                selected={carpinter}
                                setSelected={() => {
                                    if (skills) {
                                        setSkills([...skills, SkillsEnum.skillCarpinter]);
                                    } else {
                                        setSkills([SkillsEnum.skillCarpinter]);
                                    }
                                    setCarpinter(!carpinter);
                                }}
                            />
                        </ScrollView>

                        <RegisterFooterButtons
                            forwardFunction={() => handleCreateUser()}
                            titleBackButton="goBack"
                            textBackButton="VOLTAR"
                            titleForwardButton="next"
                            textForwardButton={formStage !== '3' ? 'PRÓXIMO' : 'CADASTRAR'}
                            backFunction={() => setFormStage('2')}
                        />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}
        </>
    );
};

export default Register;
