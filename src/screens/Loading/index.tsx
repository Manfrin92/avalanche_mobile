import React from 'react';

import { Container, StyledImage, StyledText, BoldText } from './styles';
import logo from '../../../assets/logo.png';

const Loading: React.FC = (): JSX.Element => {
    return (
        <Container>
            <StyledImage source={logo} />
            <StyledText>
                Avalanche {'\n'} de <BoldText>Amor</BoldText>
            </StyledText>
        </Container>
    );
};

export default Loading;
