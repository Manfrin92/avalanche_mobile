import React from 'react';
import { View } from 'react-native';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, StyledImage, NavigationText, BoldText, StageText } from './styles';

interface HelpHeaderProps {
    formCurrentStage?: string;
    formTotalStages?: string;
    isNewDate?: boolean;
    isFindNecessity?: boolean;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({
    formCurrentStage,
    formTotalStages,
    isNewDate,
    isFindNecessity,
}) => {
    return (
        <HeaderNavigatorContainer>
            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                <StyledImage source={Logo} />

                {!isFindNecessity &&
                    (isNewDate ? (
                        <NavigationText>
                            Nova <BoldText>Ajuda</BoldText>
                        </NavigationText>
                    ) : (
                        <NavigationText>
                            Nova <BoldText>Data</BoldText>
                        </NavigationText>
                    ))}

                {isFindNecessity && (
                    <NavigationText>
                        Localizar <BoldText>Necessitado</BoldText>
                    </NavigationText>
                )}
            </View>

            {!isFindNecessity && (
                <StageText>
                    {formCurrentStage}/{formTotalStages}
                </StageText>
            )}
        </HeaderNavigatorContainer>
    );
};

export default HelpHeader;
