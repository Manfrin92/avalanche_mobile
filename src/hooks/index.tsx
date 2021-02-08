import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';

import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
    <AuthProvider>
        <MenuProvider>{children}</MenuProvider>
    </AuthProvider>
);

export default AppProvider;
