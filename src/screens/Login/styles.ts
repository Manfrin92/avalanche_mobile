import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: #f0f0f0;
    align-items: center;
    justify-content: center;
`;

export const HeaderNavigatorContainer = styled.TouchableOpacity`
    flex-direction: row;
    background-color: transparent;
    width: 100%;
    height: 30px;
    align-items: center;
    margin-top: 8px;
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
    margin-top: 20px;
`;

export const Title = styled.Text`
    font-size: 24px;
    color: #e82b43;
    font-family: sans-serif;
    margin: 0px 0 24px;
`;

export const Text = styled.Text`
    font-size: 12px;
    color: #e82b43;
    font-family: sans-serif;
    margin: 32px 0 24px;
`;

export const BoldText = styled.Text`
    font-family: sans-serif;
    font-weight: bold;
    font-size: 30px;
    text-align: center;
    padding-top: 16px;
    color: #777777;
`;

export const StyledImage = styled.Image`
    width: 228px;
    height: 212px;
`;

export const StyledText = styled.Text`
    font-family: sans-serif;
    font-size: 30px;
    text-align: center;
    padding-top: 16px;
    color: #777777;
`;
