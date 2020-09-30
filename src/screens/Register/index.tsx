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
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useNavigation } from '@react-navigation/native';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Selector from '../../components/Selector';

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

interface Navigation {
    navigate(screen: string): void;
}

interface UserData {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressCity: string;
    addressState: string;
    addressComplement: string;
    addressArea: string;
    addressCountry: string;
}

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
    const [formStage, setFormStage] = useState('1');

    useEffect(() => {
        console.log('Usuário mais atualizado: ', user);
    }, [user]);

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

                        <ScrollView style={{ marginTop: '6%', marginRight: '6%', marginLeft: '6%' }}>
                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="words"
                                    placeholderTextColor="#DA4453"
                                    placeholder="NOME"
                                    onChangeText={(name) => setUser({ ...user, name })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="E-MAIL"
                                    keyboardType="email-address"
                                    onChangeText={(email) => setUser({ ...user, email })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="CPF"
                                    keyboardType="number-pad"
                                    onChangeText={(cpf) => setUser({ ...user, cpf })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholderTextColor="#DA4453"
                                    placeholder="TELEFONE"
                                    keyboardType="number-pad"
                                    onChangeText={(phoneNumber) => setUser({ ...user, phoneNumber })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    secureTextEntry
                                    placeholderTextColor="#DA4453"
                                    placeholder="SENHA"
                                    onChangeText={(password) => setUser({ ...user, password })}
                                />
                            </InputContainer>

                            <InputContainer isErrored={false} isFocused={false}>
                                <TextInput
                                    autoCapitalize="none"
                                    secureTextEntry
                                    placeholderTextColor="#DA4453"
                                    placeholder="CONFIRME A SENHA"
                                    onChangeText={(repeatPassword) => setUser({ ...user, repeatPassword })}
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
                                onPress={() => navigation.navigate('LoginRegister')}
                            />
                            <Button
                                title="next"
                                width={65}
                                buttonText="PRÓXIMO"
                                buttonType="enter"
                                onPress={() => setFormStage('2')}
                            />
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            )}

            {/* SECOND PART */}
            {formStage === '2' && (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <HeaderNavigatorContainer onPress={() => console.log('LoginEnter')}>
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
                                buttonText="PRÓXIMO"
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
                        <HeaderNavigatorContainer onPress={() => console.log('LoginEnter')}>
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
