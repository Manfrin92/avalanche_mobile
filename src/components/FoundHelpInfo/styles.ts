import styled from 'styled-components/native';

export const Container = styled.View`
    flex-direction: row;
    margin-left: 6%;
    align-items: center;
    margin-bottom: 5%;
`;

export const DateContainer = styled.View``;

export const DetailContainer = styled.View`
    margin-left: 1%;
    align-items: center;
    flex: 2;
    margin-right: 2%;
`;

export const HelpDate = styled.Text`
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
`;

export const HelpWeekDate = styled.Text`
    font-size: 12px;
    line-height: 20px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #8cc152;
    padding: 2px;
    border-width: 6px;
    border-color: #8cc152;
    border-radius: 10px;
    width: 90%;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
`;

export const HelpTitle = styled.Text`
    font-size: 16px;
    line-height: 18px;
`;

export const ButtonText = styled.Text`
    font-size: 12px;
    line-height: 14px;
    color: white;
    font-weight: bold;
`;
