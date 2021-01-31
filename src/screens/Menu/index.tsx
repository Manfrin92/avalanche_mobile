import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons, SimpleLineIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../../../assets/logo.png';

import {
    Container,
    HeaderNavigatorContainer,
    NavigationText,
    StyledImage,
    StageText,
    BoldText,
    TextInput,
    InputContainer,
    TextName,
    RedBoldText,
    Text,
} from './styles';

import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import { goToUrl } from '../../utils/AppUtil';
import { abascUrl } from '../../utils/constants';

const Menu: React.FC = () => {
    const navigation = useNavigation();
    const { signOut, user } = useAuth();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderNavigatorContainer>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 19,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <StyledImage source={Logo} />
                    <NavigationText>Menu</NavigationText>
                </View>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '4%',
                    }}
                    onPress={() => navigation.navigate('Main')}
                >
                    <AntDesign name="close" size={32} color="black" />
                </TouchableOpacity>
            </HeaderNavigatorContainer>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginRight: '8%',
                    marginTop: '10%',
                }}
            >
                <TextName>
                    Olá, <RedBoldText>{user.name}!</RedBoldText>
                </TextName>
            </View>

            <View style={{ marginLeft: '6%', marginTop: '10%' }}>
                <TouchableOpacity onPress={() => goToUrl(abascUrl)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '6%' }}>
                        <AntDesign style={{ width: '14%' }} name="questioncircleo" size={28} color="black" />
                        <Text>Como ajudar?</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '8%' }}>
                        <Ionicons style={{ width: '14%' }} name="md-search" size={28} color="black" />
                        <BoldText>Encontrar ajudas</BoldText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '8%' }}>
                        <SimpleLineIcons style={{ width: '14%' }} name="heart" size={28} color="black" />
                        <BoldText>Minhas ajudas</BoldText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate(ScreenNamesEnum.UpdateRegister)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '8%' }}>
                        <FontAwesome5 style={{ width: '14%' }} name="user-alt" size={28} color="black" />
                        <Text>Meus dados</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signOut()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '8%' }}>
                        <MaterialCommunityIcons style={{ width: '14%' }} name="logout" size={28} color="#F08902" />
                        <TextName>Sair</TextName>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Menu;
