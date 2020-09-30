import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/Button';

import { StyledText, StyledImage, FormView, ButtonContainer, BoldText } from './styles';

import Logo from '../../../assets/logo.png';

interface Navigation {
    navigate(screen: string): void;
}

interface LoginRegisterData {
    navigation: Navigation;
}

const LoginRegister: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <StyledImage source={Logo} />
            <StyledText>
                Avalanche {'\n'} de <BoldText>Amor</BoldText>
            </StyledText>
            <FormView>
                <ButtonContainer>
                    <Button
                        title="enter"
                        buttonText="entrar"
                        buttonType="enter"
                        onPress={() => navigation.navigate('Login')}
                    />

                    <Button
                        title="register"
                        buttonText="cadastrar"
                        buttonType="register"
                        onPress={() => navigation.navigate('Register')}
                    />
                </ButtonContainer>
            </FormView>
        </SafeAreaView>
    );
};

export default LoginRegister;
