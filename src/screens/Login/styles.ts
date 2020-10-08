import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin-left: 6%;
    margin-right: 6%;
`;

export const HeaderNavigatorContainer = styled.TouchableOpacity`
    flex-direction: row;
    background-color: transparent;
    width: 100%;
    height: 30px;
    align-items: center;
    margin-top: 8%;
`;

export const NavigationText = styled.Text`
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.01px;
    font-family: sans-serif;
    color: #acacac;
    padding-left: 15px;
`;

export const Content = styled.View`
    margin: auto 0;
    align-items: center;
    justify-content: center;
    padding: 0 6%;
`;

export const ViewButton = styled.View`
    margin-top: 2%;
    margin-bottom: 8%;
`;

export const Title = styled.Text`
    font-size: 24px;
    color: #e82b43;
    font-family: sans-serif;
    margin: 0px 0 24px;
`;

export const Text = styled.Text`
    font-size: 12px;
    color: #da4453;
    font-family: sans-serif;
    margin-bottom: 8%;
    align-self: center;
`;

export const BoldText = styled.Text`
    font-family: sans-serif;
    font-weight: bold;
    font-size: 32px;
    text-align: center;
    margin-bottom: 18%;
    color: #434a54;
`;

export const StyledImage = styled.Image`
    width: 160px;
    height: 146px;
    margin-bottom: 12%;
`;

export const StyledText = styled.Text`
    font-family: sans-serif;
    font-size: 32px;
    text-align: center;
    color: #434a54;
    margin-bottom: 16%;
`;
