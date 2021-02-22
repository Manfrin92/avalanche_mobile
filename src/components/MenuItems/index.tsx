import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, SimpleLineIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import {
    Container,
    NameContainer,
    TextName,
    RedBoldText,
    ItemsContainer,
    ItemContainer,
    Text,
    BoldText,
} from './styles';

interface MenuItemsProps {
    userName: string;
    goToUrl(): void;
    navigateToUpdateRegister(): void;
    signOut(): void;
    navigateToFindHelp(): void;
    navigateToMain(): void;
}

const MenuItems: React.FC<MenuItemsProps> = ({
    userName,
    goToUrl,
    navigateToUpdateRegister,
    navigateToFindHelp,
    signOut,
    navigateToMain,
}) => {
    return (
        <Container>
            <NameContainer>
                <TextName>
                    Olá, <RedBoldText>{userName}!</RedBoldText>
                </TextName>
            </NameContainer>

            <ItemsContainer>
                <TouchableOpacity onPress={goToUrl}>
                    <ItemContainer>
                        <AntDesign style={{ width: '14%' }} name="questioncircleo" size={28} color="black" />
                        <Text>Como ajudar?</Text>
                    </ItemContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToFindHelp}>
                    <ItemContainer style={{ marginBottom: '8%' }}>
                        <Ionicons style={{ width: '14%' }} name="md-search" size={28} color="black" />
                        <BoldText>Encontrar ajudas</BoldText>
                    </ItemContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToMain}>
                    <ItemContainer style={{ marginBottom: '8%' }}>
                        <SimpleLineIcons style={{ width: '14%' }} name="heart" size={28} color="black" />
                        <BoldText>Minhas ajudas</BoldText>
                    </ItemContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToUpdateRegister}>
                    <ItemContainer style={{ marginBottom: '8%' }}>
                        <FontAwesome5 style={{ width: '14%' }} name="user-alt" size={28} color="black" />
                        <Text>Meus dados</Text>
                    </ItemContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={signOut}>
                    <ItemContainer style={{ marginBottom: '8%' }}>
                        <MaterialCommunityIcons style={{ width: '14%' }} name="logout" size={28} color="#da4453" />
                        <TextName>Sair</TextName>
                    </ItemContainer>
                </TouchableOpacity>
            </ItemsContainer>
        </Container>
    );
};

export default MenuItems;
