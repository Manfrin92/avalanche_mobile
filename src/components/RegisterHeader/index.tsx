import React from 'react';
import Logo from '../../../assets/logo.png';

import {
    HeaderNavigatorContainer,
    HeaderLeftContainer,
    NavigationText,
    BoldText,
    StyledImage,
    StageText,
} from './styles';

interface RegisterHeaderProps {
    formStage: string;
    formLength: string;
}

const RegisterHeader: React.FC<RegisterHeaderProps> = ({ formStage, formLength }) => {
    return (
        <HeaderNavigatorContainer>
            <HeaderLeftContainer>
                <StyledImage source={Logo} />
                <NavigationText>
                    Cadastro {formStage === '2' && <BoldText> Endereço</BoldText>}
                    {formStage === '3' && <BoldText>Habilidades</BoldText>}
                </NavigationText>
            </HeaderLeftContainer>
            <StageText>
                {formStage}/{formLength}{' '}
            </StageText>
        </HeaderNavigatorContainer>
    );
};

export default RegisterHeader;
