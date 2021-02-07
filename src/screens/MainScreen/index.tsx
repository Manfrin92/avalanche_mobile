import React, { useCallback, useState, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import api from '../../services/api';
import MainHeader from '../../components/MainHeader';
import HelpItem from '../../components/HelpItem';
import NewHelpButton from '../../components/NewHelpButton';
import { HelpDataToShow } from '../../utils/Interfaces';
import { ScreenNamesEnum } from '../../utils/enums';
import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';

const MainScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [helps, setHelps] = useState([] as HelpDataToShow[]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const handleExcludeHelp = useCallback(
        async (id: string) => {
            try {
                Alert.alert('Excluir ajuda', 'Realmente deseja excluir a ajuda?', [
                    {
                        text: 'Não',
                        style: 'cancel',
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            setLoading(true);
                            await api.delete('help', {
                                data: {
                                    id,
                                },
                            });
                            const newHelps = helps.filter((help) => help.id !== id);
                            setHelps(newHelps);
                            setLoading(false);
                        },
                    },
                ]);
            } catch (e) {
                Alert.alert('Não foi possível deletar a ajuda');
                // // console.log(e);
            }
        },
        [helps],
    );

    const getHelpsByUser = useCallback(async () => {
        try {
            if (user && user.id) {
                const helpsRaw = await api.post('/help/findHelps', {
                    userManagerId: user.id,
                });
                setHelps([...helpsRaw.data]);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    }, [user]);

    useEffect(() => {
        getHelpsByUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MainHeader navigateToMenu={() => navigation.navigate(ScreenNamesEnum.Menu)} />

            <ScrollView>
                {helps.length > 0 &&
                    helps.map((help) => {
                        return (
                            <HelpItem
                                ExcludeHelp={() => handleExcludeHelp(help.id)}
                                key={help.id}
                                id={help.id}
                                title={help.title}
                            />
                        );
                    })}
            </ScrollView>

            <NewHelpButton navigateToNewHelp={() => navigation.navigate(ScreenNamesEnum.NewHelp)} />
        </SafeAreaView>
    );
};

export default MainScreen;
