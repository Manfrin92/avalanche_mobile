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
    height: 6%;
    margin-top: 10%;
    border-bottom-width: 1px;
    border-bottom-color: #ccd1d9;
    padding-bottom: 3%;
    justify-content: space-between;
`;

export const NavigationText = styled.Text`
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -0.01px;
    font-family: sans-serif;
    color: #434a54;
    align-self: center;
    padding-left: 18px;
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
`;

export const BoldText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: -0.01px;
    font-family: sans-serif;
    color: #434a54;
    align-self: center;
`;

export const StyledImage = styled.Image`
    width: 36px;
    height: 33px;
    align-self: center;
`;

export const StyledText = styled.Text`
    font-family: sans-serif;
    font-size: 32px;
    text-align: center;
    color: #434a54;
    margin-bottom: 16%;
`;

export const StageText = styled.Text`
    font-family: sans-serif;
    font-size: 22px;
    align-self: center;
    line-height: 22px;
    text-align: center;
    color: #4a89dc;
    margin-right: 4%;
`;
