import styled, { css } from 'styled-components/native';

interface ContainerProps {
    isErrored: boolean;
    height?: number;
    width?: number;
    marginBottom: number;
}

export const Container = styled.View<ContainerProps>`
    flex-direction: row;
    height: ${(props) => (props.height ? '150px' : '55px')};
    margin: 0 6% 1% 6%;
    background-color: #acacac;
    border-width: 2px;
    border-style: solid;
    border-color: #fff;
    border-radius: 8px;

    /* border-top-width: 0; */
    align-items: stretch;
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

    ${(props) =>
        props.marginBottom &&
        css`
            margin-bottom: ${props.marginBottom}px;
        `}

        ${(props) =>
        props.width &&
        css`
            height: ${props.height}%;
        `}
`;

export const TextInput = styled.TextInput`
    flex: 1;

    font-size: 20px;
    color: #ffffff;
    background-color: #acacac;
    padding-left: 10px;
    /* margin-right: 80px; */
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
