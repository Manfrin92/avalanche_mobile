import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, NavigationText, StyledImage, Container } from './styles';

interface UpdateRegisterHeaderProps {
    navigateToMenu(): void;
}

const UpdateRegisterHeader: React.FC<UpdateRegisterHeaderProps> = ({ navigateToMenu }) => {
    return (
        <HeaderNavigatorContainer>
            <Container>
                <StyledImage source={Logo} />
                <NavigationText>Alteração de Cadastro</NavigationText>
                <TouchableOpacity onPress={navigateToMenu} style={{ marginLeft: '16%' }}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            </Container>
        </HeaderNavigatorContainer>
    );
};

export default UpdateRegisterHeader;
