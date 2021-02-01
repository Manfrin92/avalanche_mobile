import styled from 'styled-components/native';

export const HeaderNavigatorContainer = styled.View`
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

export const HeaderLeftContainer = styled.View`
    flex: 1;
    flex-direction: row;
    margin-left: 19px;
    align-items: center;
    justify-content: flex-start;
`;

export const StyledImage = styled.Image`
    width: 36px;
    height: 33px;
    align-self: center;
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

export const NavigationText = styled.Text`
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -0.01px;
    font-family: sans-serif;
    color: #434a54;
    align-self: center;
    padding-left: 18px;
`;
