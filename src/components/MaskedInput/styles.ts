import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isErrored: boolean;
    width?: number;
    marginBottom?: number;
}

export const Container = styled.View<ContainerProps>`
    flex-direction: row;
    height: 55px;
    margin: 0 6% 1% 6%;
    background-color: #acacac;
    border-width: 2px;
    border-style: solid;
    border-color: #fff;
    border-radius: 8px;
    align-items: center;
    justify-content: flex-start;
    padding-left: 5px;

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
            margin-right: 0;
            margin-left: 0;
            margin-bottom: 0;
            margin-right: 0;
            flex-direction: column;
        `}

    ${(props) =>
        props.marginBottom &&
        css`
            margin-bottom: ${props.marginBottom}%;
        `}
`;

export const TextInput = styled.TextInput`
    flex: 1;
    font-size: 20px;
    color: #ffffff;
    padding-left: 10px;
    background-color: transparent;
    width: 100%;
`;

export const Label = styled.Text`
    font-size: 12px;
    line-height: 13px;
    color: #fff;
    padding: 5px;
`;

export const LabelContainer = styled.View`
    margin-bottom: -2%;
    margin-left: 9%;
    z-index: 1;
    align-self: flex-start;
    border-radius: 8px;
    border-width: 1px;
    border-color: #fff;
    background-color: #acacac;
`;
