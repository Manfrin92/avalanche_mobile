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

import Logo from '../../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input/LoginInput';

import { Container, HeaderNavigatorContainer, NavigationText, StyledImage, StageText, BoldText } from './styles';

interface Navigation {
    navigate(screen: string): void;
}

const Register: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const [formStage, setFormStage] = useState('3');

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
            <Container />
        </SafeAreaView>
    );
};

export default Register;
