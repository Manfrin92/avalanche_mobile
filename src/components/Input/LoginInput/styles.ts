import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isFocused: boolean;
    isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    height: 60px;
    padding: 0 16px;
    background: #acacac;
    border-radius: 10px;
    margin-bottom: 8px;
    border-width: 2px;
    border-color: #fff;

    flex-direction: row;
    align-items: center;

    ${(props) =>
        props.isErrored &&
        css`
            border-color: #c53030;
        `}

    ${(props) =>
        props.isFocused &&
        css`
            border-color: #e82b43;
        `}
`;
export const TextInput = styled.TextInput`
    flex: 1;
    color: #666360;
    font-size: 16px;
    font-family: sans-serif;
`;
