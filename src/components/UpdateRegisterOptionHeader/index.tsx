import React from 'react';
import Logo from '../../../assets/logo.png';

import { HeaderNavigatorContainer, NavigationText, StyledImage, Container, BoldText, StageText } from './styles';

interface UpdateRegisterOptionHeaderProps {
    formStage: string;
}

// style={{ flexDirection: 'row', marginLeft: 19 }}

const UpdateRegisterOptionHeader: React.FC<UpdateRegisterOptionHeaderProps> = ({ formStage }) => {
    return (
        <HeaderNavigatorContainer>
            <Container>
                <StyledImage source={Logo} />
                <NavigationText>Cadastro {formStage === '2' && <BoldText> Endereço</BoldText>}</NavigationText>
            </Container>
            <StageText>{formStage}/2 </StageText>
        </HeaderNavigatorContainer>
    );
};

export default UpdateRegisterOptionHeader;
