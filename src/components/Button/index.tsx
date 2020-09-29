import React from 'react';
import { ButtonProps } from 'react-native';

import { StyledButton, Text, Container } from './styles';

interface EnterButtonProps extends ButtonProps {
    width?: number;
    buttonType: 'enter' | 'register' | 'goBack';
    buttonText: string;
}

const Button: React.FC<EnterButtonProps> = ({ buttonType, buttonText, width, ...rest }) => {
    return (
        <Container width={width} buttonType={buttonType}>
            <StyledButton {...rest}>
                <Text buttonType={buttonType}>{buttonText}</Text>
            </StyledButton>
        </Container>
    );
};

export default Button;
