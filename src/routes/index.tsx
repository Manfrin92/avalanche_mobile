import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/auth';

import AppRoutes from './App';
import AuthRoutes from './Auth';

const Routes: React.FC = () => {
    const { user, loading } = useAuth();

    useEffect(() => {
        console.log('rodou o user? ', user);
    }, [user]);

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
