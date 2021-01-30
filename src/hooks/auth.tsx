import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface SignInCredentials {
    email: string;
    password: string;
}

interface UserStoraged {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    address: string;
}

interface AuthContextData {
    user: UserStoraged;
    signIn(credentials: SignInCredentials): Promise<boolean>;
    signOut(): void;
    loading: boolean;
    setData({ token, user }: AuthState): void;
    token: string;
}

interface AuthState {
    token: string;
    user: UserStoraged;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AuthState>({} as AuthState);

    const loadStoragedData = useCallback(async () => {
        const [token, user] = await AsyncStorage.multiGet(['@Avalanche:token', '@Avalanche:user']);

        if (token[1] && user[1]) {
            setData({ token: token[1], user: JSON.parse(user[1]) });
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        loadStoragedData();
    }, []);

    const signIn = useCallback(async ({ email, password }) => {
        try {
            setLoading(true);
            const response = await api.post('/user/logIn', {
                email,
                password,
            });

            const { token } = response.data;
            const { user } = response.data;

            delete user.password;

            await AsyncStorage.multiSet([
                ['@Avalanche:token', token],
                ['@Avalanche:user', JSON.stringify(user)],
            ]);

            setData({ token, user });
            setLoading(false);
        } catch (err) {
            console.log('ssignin: ', err);
            if (err.message && err.message.toLowerCase().includes('network error')) {
                Alert.alert('Falha ao acessar a netword error API');
            }
            if (err.response.data && err.response.data.message && err.response.data.message.message) {
                Alert.alert('Cheque suas credenciais.');
            } else {
                console.log(err);
                Alert.alert('Falha no login, cheque suas credenciais');
            }
            setLoading(false);
            return false;
        }
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(['@Avalanche:user', '@Avalanche:token']);

        setData({} as AuthState);

        BackHandler.exitApp();
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading, setData, token: data.token }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };
