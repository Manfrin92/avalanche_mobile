import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import Logo from '../../../assets/logo.png';
import { CloseTouchable } from '../MenuHeader/styles';

import { HeaderNavigatorContainer, StyledImage, NavigationText, BoldText, StageText } from './styles';

interface HelpHeaderProps {
    formCurrentStage?: string;
    formTotalStages?: string;
    isNewDate?: boolean;
    isFindNecessity?: boolean;
    isFindHelpDate?: boolean;
    navigateToMain?(): void;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({
    formCurrentStage,
    formTotalStages,
    isNewDate,
    isFindNecessity,
    isFindHelpDate,
    navigateToMain,
}) => {
    return (
        <HeaderNavigatorContainer>
            <View style={{ flexDirection: 'row', marginLeft: 19 }}>
                <StyledImage source={Logo} />

                {isFindHelpDate && (
                    <View style={{ flexDirection: 'row' }}>
                        <NavigationText>
                            Encontrar <BoldText>Ajudas</BoldText>
                        </NavigationText>

                        <CloseTouchable style={{ marginLeft: '33%' }} onPress={navigateToMain}>
                            <AntDesign name="close" size={32} color="black" />
                        </CloseTouchable>
                    </View>
                )}

                {!isFindNecessity &&
                    !isFindHelpDate &&
                    (isNewDate ? (
                        <NavigationText>
                            Nova <BoldText>Ajuda</BoldText>
                        </NavigationText>
                    ) : (
                        <NavigationText>
                            Nova <BoldText>Data</BoldText>
                        </NavigationText>
                    ))}

                {isFindNecessity && !isFindHelpDate && (
                    <NavigationText>
                        Localizar <BoldText>Necessitado</BoldText>
                    </NavigationText>
                )}
            </View>

            {!isFindNecessity && !isFindHelpDate && (
                <StageText>
                    {formCurrentStage}/{formTotalStages}
                </StageText>
            )}
        </HeaderNavigatorContainer>
    );
};

export default HelpHeader;
