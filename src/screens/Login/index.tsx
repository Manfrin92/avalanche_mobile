import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    TextInput,
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
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import * as Network from 'expo-network';

import { useNavigation } from '@react-navigation/native';
import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input/LoginInput';
import getValidationsErrors from '../../utils/getValidationsErrors';
import { goToUrl } from '../../utils/AppUtil';

import {
    Container,
    StyledImage,
    StyledText,
    HeaderNavigatorContainer,
    NavigationText,
    Content,
    Title,
    ViewButton,
    Text,
    BoldText,
} from './styles';

interface Navigation {
    navigate(screen: string): void;
}

interface LoginRegisterData {
    navigation: Navigation;
}

interface SignInFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const [connected, setConnected] = useState<boolean | undefined>(true);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
        Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

        return () => {
            Keyboard.removeAllListeners('keyboardDidShow');
            Keyboard.removeAllListeners('keyboardDidHide');
        };
    });

    useEffect(() => {
        async function checkConnection(): Promise<void> {
            const isConnected = await Network.getNetworkStateAsync();
            setConnected(isConnected.isConnected);
        }

        checkConnection();

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardOpen(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // const { signIn } = useAuth();

    // const navigate = useCallback(() => {
    //     navigation.navigate('Error');
    // }, [navigation]);

    // const navigateToError = useCallback(
    //     (firstMessage: string, secondMessage: string) => {
    //         navigation.navigate('Error', {
    //             firstMessage,
    //             secondMessage,
    //         });
    //     },
    //     [navigation],
    // );

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().trim().required('E-mail obrigatório').email('Digite um email válido'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, { abortEarly: false });

            // signIn({
            //     email: data.email.trim(),
            //     password: data.password,
            //     navigateToError,
            // });
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationsErrors(err);
                formRef.current?.setErrors(errors);
                if (errors.email) Alert.alert(errors.email);
                if (errors.password) Alert.alert(errors.password);
                return;
            }

            Alert.alert('Erro na autenticação', 'Favor verificar seu e-mail e senha');
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderNavigatorContainer onPress={() => navigation.navigate('LoginRegister')}>
                <Feather name="arrow-left" size={22} color="#ACACAC" style={{ paddingLeft: 12 }} />
                <NavigationText>Voltar</NavigationText>
            </HeaderNavigatorContainer>
            <Container>
                <StyledImage style={{ display: keyboardOpen ? 'none' : null }} source={Logo} />
                <StyledText>
                    Avalanche {'\n'} de <BoldText>Amor</BoldText>
                </StyledText>

                <Form ref={formRef} onSubmit={handleSignIn}>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        name="email"
                        icon="mail"
                        placeholder="E-mail"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            passwordInputRef.current?.focus();
                        }}
                    />
                    <Input
                        ref={passwordInputRef}
                        secureTextEntry
                        autoCapitalize="none"
                        name="password"
                        icon="lock"
                        placeholder="Senha"
                        returnKeyType="send"
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                    <ViewButton>
                        <Button
                            buttonType="enter"
                            buttonText="entrar"
                            onPress={() => formRef.current?.submitForm()}
                        />
                    </ViewButton>

                    <Text>ESQUECI MINHA SENHA</Text>
                </Form>
            </Container>
        </SafeAreaView>
    );
};

export default Login;
