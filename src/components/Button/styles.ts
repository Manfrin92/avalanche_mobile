import styled, { css } from 'styled-components/native';

interface ContainerProps {
    buttonType: 'enter' | 'register';
}
interface ButtonProps {
    buttonType: 'enter' | 'register';
}

export const Container = styled.View<ContainerProps>`
    height: 55px;
    justify-content: center;
    border-radius: 10px;

    ${(props: ContainerProps) =>
        props.buttonType === 'enter' &&
        css`
            background-color: #da4453;
        `}

    ${(props: ContainerProps) =>
        props.buttonType === 'register' &&
        css`
            background-color: #f9f9f9;
            border: 2px solid #e82b43;
            margin-top: 4%;
        `}
`;

export const StyledButton = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
`;

export const Text = styled.Text<ButtonProps>`
    font-family: sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;

    ${(props: ButtonProps) =>
        props.buttonType === 'enter' &&
        css`
            color: #ffffff;
        `}

    ${(props: ButtonProps) =>
        props.buttonType === 'register' &&
        css`
            color: #e82b43;
        `}
`;

export const BoldText = styled.Text`
    font-family: sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
`;
