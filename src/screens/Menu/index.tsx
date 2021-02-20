import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';
import { goToUrl } from '../../utils/AppUtil';
import { abascUrl } from '../../utils/constants';
import MenuHeader from '../../components/MenuHeader';
import MenuItems from '../../components/MenuItems';

const Menu: React.FC = () => {
    const navigation = useNavigation();
    const { signOut, user } = useAuth();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MenuHeader navigateToMain={() => navigation.navigate('Main')} />

            <MenuItems
                goToUrl={() => goToUrl(abascUrl)}
                navigateToUpdateRegister={() => navigation.navigate(ScreenNamesEnum.UpdateRegister)}
                navigateToFindHelp={() => navigation.navigate(ScreenNamesEnum.FindHelp)}
                signOut={() => signOut()}
                userName={user.name}
            />
        </SafeAreaView>
    );
};

export default Menu;
