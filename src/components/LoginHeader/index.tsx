import React from 'react';
import { Feather } from '@expo/vector-icons';

import { HeaderNavigatorContainer, NavigationText } from './styles';

interface LoginHeaderProps {
    navigateToLoginRegister(): void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ navigateToLoginRegister }) => {
    return (
        <HeaderNavigatorContainer onPress={navigateToLoginRegister}>
            <Feather name="arrow-left" size={22} color="#ACACAC" style={{ paddingLeft: 12 }} />
            <NavigationText>Voltar</NavigationText>
        </HeaderNavigatorContainer>
    );
};

export default LoginHeader;
