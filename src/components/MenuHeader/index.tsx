import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, Container, StyledImage, CloseTouchable, NavigationText } from './styles';

interface MenuHeaderProps {
    navigateToMain(): void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ navigateToMain }) => {
    return (
        <HeaderNavigatorContainer>
            <Container>
                <StyledImage source={Logo} />
                <NavigationText>Menu</NavigationText>
            </Container>
            <CloseTouchable onPress={navigateToMain}>
                <AntDesign name="close" size={32} color="black" />
            </CloseTouchable>
        </HeaderNavigatorContainer>
    );
};

export default MenuHeader;
