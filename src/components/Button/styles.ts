import styled, { css } from 'styled-components/native';

interface ContainerProps {
    buttonType: 'enter' | 'register' | 'goBack';
    width: number;
}
interface ButtonProps {
    buttonType: 'enter' | 'register' | 'goBack';
}

export const Container = styled.View<ContainerProps>`
    height: 55px;
    justify-content: center;
    border-radius: 10px;

    ${(props) =>
        props.width &&
        css`
            width: ${props.width}%;
            margin-right: 0%;
            margin-left: 0%;
        `}

    ${(props: ContainerProps) =>
        props.buttonType === 'enter' &&
        css`
            background-color: #da4453;
        `}

    ${(props: ContainerProps) =>
        props.buttonType === 'register' &&
        css`
            background-color: #f9f9f9;
            border: 2px solid #da4453;
            margin-top: 4%;
        `}

        ${(props: ContainerProps) =>
        props.buttonType === 'goBack' &&
        css`
            background-color: #f9f9f9;
        `}
`;

export const StyledButton = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
`;

export const Text = styled.Text<ButtonProps>`
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
            color: #da4453;
        `}

        ${(props: ButtonProps) =>
        props.buttonType === 'goBack' &&
        css`
            color: #da4453;
        `}
`;

export const BoldText = styled.Text`
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
`;
