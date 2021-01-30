import React from 'react';
import { View } from 'react-native';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, StyledImage, NavigationText, BoldText, StageText } from './styles';

interface RegisterHeaderProps {
    formCurrentStage: string;
    formTotalStages: string;
}

const RegisterHeader: React.FC<RegisterHeaderProps> = ({ formCurrentStage, formTotalStages }) => {
    return (
        <HeaderNavigatorContainer>
            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                <StyledImage source={Logo} />
                <NavigationText>
                    Nova <BoldText>Ajuda</BoldText>
                </NavigationText>
            </View>
            <StageText>
                {formCurrentStage}/{formTotalStages}
            </StageText>
        </HeaderNavigatorContainer>
    );
};

export default RegisterHeader;
