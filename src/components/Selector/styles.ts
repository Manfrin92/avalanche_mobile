import styled, { css } from 'styled-components/native';

interface SquareProps {
    selected: boolean;
}

export const OptionContainer = styled.TouchableOpacity`
    flex-direction: row;
`;

export const Square = styled.View<SquareProps>`
    height: 22px;
    width: 22px;
    border-color: #F08902;
    border-width: 2px;
    justify-content: center;
    align-items: center;

    ${(props) =>
        props.selected &&
        css`
            background-color: #F08902;
        `}
`;

export const OptionText = styled.Text`
    font-family: sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
    padding-left: 5%;
`;
