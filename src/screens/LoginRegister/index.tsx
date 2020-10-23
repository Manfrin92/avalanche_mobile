import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/Button';

import { StyledText, StyledImage, FormView, ButtonContainer, BoldText } from './styles';

import Logo from '../../../assets/logo.png';
import { ScreenNamesEnum } from '../../utils/enums';

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
                        onPress={() => navigation.navigate(ScreenNamesEnum.Login)}
                    />

                    <Button
                        title="register"
                        buttonText="cadastrar"
                        buttonType="register"
                        onPress={() => navigation.navigate(ScreenNamesEnum.Register)}
                    />
                </ButtonContainer>
            </FormView>
        </SafeAreaView>
    );
};

export default LoginRegister;
