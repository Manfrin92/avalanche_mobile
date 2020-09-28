import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isErrored: boolean;
    width?: number;
}

export const Container = styled.View<ContainerProps>`
    flex-direction: row;
    height: 55px;
    margin-bottom: 16px;
    margin-right: 6%;
    margin-left: 6%;
    background-color: #acacac;
    border-width: 2px;
    border-style: solid;
    border-color: #fff;
    border-radius: 8px;
    align-items: center;
    justify-content: flex-start;

    ${(props) =>
        props.isErrored &&
        css`
            border-color: #fa403b;
        `}

    &&+View {
        margin-bottom: 50px;
    }

    ${(props) =>
        props.width &&
        css`
            width: ${props.width}%;
            margin-right: 0%;
            margin-left: 0%;
        `}
`;

export const TextInput = styled.TextInput`
    flex: 1;
    font-family: sans-serif;
    font-size: 20px;
    color: #ffffff;
    background-color: #acacac;
    padding-left: 10px;
    /* margin-right: 80px; */
`;
