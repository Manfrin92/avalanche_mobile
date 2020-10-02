import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
    flex-direction: row;
    height: 55px;
    margin-bottom: 16px;
    background-color: #f9f9f9;
    border-width: 2px;
    border-style: solid;
    border-color: #da4453;
    border-radius: 8px;
    align-items: center;
    justify-content: flex-start;

    && + View {
        margin-bottom: 50px;
    }
`;

export const TextInput = styled.TextInput`
    flex: 1;
    font-family: sans-serif;
    font-size: 20px;
    color: #da4453;
    padding-left: 10px;
    /* margin-right: 80px; */
`;
