import React from 'react';
import Button from '../Button';

import { Container } from './styles';

interface RegisterFooterButtonsProps {
    titleBackButton: string;
    textBackButton: string;
    titleForwardButton: string;
    textForwardButton: string;
    backFunction(): void;
    forwardFunction(): void;
}

const RegisterFooterButtons: React.FC<RegisterFooterButtonsProps> = ({
    titleBackButton,
    textBackButton,
    titleForwardButton,
    textForwardButton,
    backFunction,
    forwardFunction,
}) => {
    return (
        <Container>
            <Button
                title={titleBackButton}
                width={33}
                buttonText={textBackButton}
                buttonType="goBack"
                onPress={backFunction}
            />
            <Button
                title={titleForwardButton}
                width={65}
                buttonText={textForwardButton}
                buttonType="enter"
                onPress={forwardFunction}
            />
        </Container>
    );
};

export default RegisterFooterButtons;
