import styled from 'styled-components/native';

interface ContainerProps {
    id: string;
}

export const Container = styled.View<ContainerProps>`
    margin-bottom: 2%;
    margin-left: 6%;
`;

export const TouchableOption = styled.TouchableOpacity`
    align-items: center;
    flex-direction: row;
    align-items: center;
`;

export const OutsideCircle = styled.View`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border-color: black;
    border-width: 2px;
    align-items: center;
    justify-content: center;
`;

export const InsideCircle = styled.View`
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: black;
`;

export const Text = styled.Text`
    margin-left: 4%;
`;
