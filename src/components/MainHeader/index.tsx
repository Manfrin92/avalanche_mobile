import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, HeaderLeftContainer, NavigationText, BoldText, StyledImage } from './styles';

interface MainHeaderProps {
    navigateToMenu(): void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ navigateToMenu }) => {
    return (
        <HeaderNavigatorContainer>
            <HeaderLeftContainer>
                <StyledImage source={Logo} />
                <NavigationText>
                    Minhas <BoldText>Ajudas</BoldText>
                </NavigationText>
            </HeaderLeftContainer>
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '4%',
                }}
                onPress={navigateToMenu}
            >
                <Entypo name="menu" size={40} color="black" />
            </TouchableOpacity>
        </HeaderNavigatorContainer>
    );
};

export default MainHeader;
