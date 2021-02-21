import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin-left: 6%;
    margin-right: 6%;
`;

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

export const Content = styled.View`
    margin: auto 0;
    align-items: center;
    justify-content: center;
    padding: 0 6%;
`;

export const DateContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ViewButton = styled.View`
    margin-top: 2%;
    margin-bottom: 8%;
`;

export const Title = styled.Text`
    font-size: 24px;
    color: #434a54;

    margin: 0px 0 24px;
`;

export const Text = styled.Text`
    font-size: 18px;
    color: #f08902;
`;

export const BoldText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: -0.01px;

    color: #434a54;
    align-self: center;
`;

export const StyledImage = styled.Image`
    width: 36px;
    height: 33px;
    align-self: center;
`;

export const StyledText = styled.Text`
    font-size: 32px;
    text-align: center;
    color: #434a54;
    margin-bottom: 16%;
`;

export const StageText = styled.Text`
    font-size: 22px;
    align-self: center;
    line-height: 22px;
    text-align: center;
    color: #4a89dc;
    margin-right: 4%;
`;

export const TextTitle = styled.Text`
    font-size: 22px;
    line-height: 23px;
    color: #434a54;
    margin-bottom: 2%;
    margin-left: 6%;
`;

export const DescriptionText = styled.Text`
    font-size: 16px;
    line-height: 17px;
    color: #434a54;
    margin-left: 4%;
`;

export const DateText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    line-height: 23px;
    color: #434a54;
`;

export const HelpTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    line-height: 23px;
    color: #4a89dc;
`;

export const HelpSubTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #434a54;
`;

export const HelpDescription = styled.Text`
    font-size: 14px;
    color: #434a54;
    margin-top: 3%;
`;

export const styles = StyleSheet.create({
    menuContainer: {
        width: '88%',
        height: 64,
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#acacac',
        borderRadius: 8,
        marginTop: 20,
        padding: 14,
    },
    menuWrapper: {
        borderRadius: 10,
        width: '100%',
        // paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f9f9f9',
        flex: 1,
    },
    menuOption: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 50,
        alignSelf: 'center',
    },
});

export const menuSelectedTextAvailable = {
    triggerText: {
        color: '#f6f6f6',
        fontSize: 16,
        lineHeight: 17,
    },
    triggerTouchable: {
        style: {
            flex: 1,
        },
    },
    triggerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 32,
        borderRadius: 10,
    },
};

export const Label = styled.Text`
    font-size: 12px;
    line-height: 13px;
    color: #fff;
    padding: 5px;
`;
