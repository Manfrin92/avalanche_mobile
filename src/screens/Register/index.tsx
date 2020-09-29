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

import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
// import Input from '../../components/Input';

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
    const [user, setUser] = useState({} as UserData);
    const [fullName, setFullName] = useState('');
    const [formStage, setFormStage] = useState('1');

    useEffect(() => {
        console.log('Usuário mais atualizado: ', user);
    }, [user]);

    return (
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

            <View
                style={{
                    marginTop: '6%',
                }}
            >
                <View style={{ marginRight: '6%', marginLeft: '6%' }}>
                    {/* FIRST PART */}
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
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: '50%',
                        }}
                    >
                        <Button
                            title="goBack"
                            width={33}
                            buttonText="VOLTAR"
                            buttonType="goBack"
                            onPress={() => console.log('apertou')}
                        />
                        <Button
                            title="next"
                            width={65}
                            buttonText="PRÓXIMO"
                            buttonType="enter"
                            onPress={() => console.log('apertou')}
                        />
                    </View>
                </View>
            </View>

            <Container />
        </SafeAreaView>
    );
};

export default Register;
