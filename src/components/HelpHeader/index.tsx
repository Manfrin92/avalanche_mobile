import React from 'react';
import { View } from 'react-native';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, StyledImage, NavigationText, BoldText, StageText } from './styles';

interface HelpHeaderProps {
    formCurrentStage: string;
    formTotalStages: string;
    isNewDate?: boolean;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({ formCurrentStage, formTotalStages, isNewDate }) => {
    return (
        <HeaderNavigatorContainer>
            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                <StyledImage source={Logo} />

                {isNewDate ? (
                    <NavigationText>
                        Nova <BoldText>Ajuda</BoldText>
                    </NavigationText>
                ) : (
                    <NavigationText>
                        Nova <BoldText>Data</BoldText>
                    </NavigationText>
                )}
            </View>
            <StageText>
                {formCurrentStage}/{formTotalStages}
            </StageText>
        </HeaderNavigatorContainer>
    );
};

export default HelpHeader;
