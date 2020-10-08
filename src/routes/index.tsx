import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/auth';

import AppRoutes from './App';
import AuthRoutes from './Auth';

const Routes: React.FC = () => {
    const { user, loading } = useAuth();

    console.log('Entrou de novo na lógica das rotas com o user: ', user ? console.log(true) : console.log(false));

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />
        );
    }
    return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
