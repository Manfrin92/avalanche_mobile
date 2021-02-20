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

export const NavigationText = styled.Text`
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -0.01px;

    color: #434a54;
    align-self: center;
    padding-left: 18px;
`;

export const StyledImage = styled.Image`
    width: 36px;
    height: 33px;
    align-self: center;
`;

export const Container = styled.View`
    flex: 1;
    flex-direction: row;
    margin-left: 19px;
    align-items: center;
    justify-content: flex-start;
`;

export const CloseTouchable = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    margin-right: 4%;
`;
