import React from 'react';
import { ButtonProps } from 'react-native';

import { StyledButton, Text, Container } from './styles';

interface EnterButtonProps extends ButtonProps {
    title?: string;
    buttonType: 'enter' | 'register';
    buttonText: string;
}

const Button: React.FC<EnterButtonProps> = ({ buttonType, buttonText, ...rest }) => {
    return (
        <Container buttonType={buttonType}>
            <StyledButton {...rest}>
                <Text buttonType={buttonType}>{buttonText}</Text>
            </StyledButton>
        </Container>
    );
};

export default Button;
