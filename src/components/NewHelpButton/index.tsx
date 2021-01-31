import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, EmptySpace } from './styles';

interface NewHelpButtonProps {
    navigateToNewHelp(): void;
}

const NewHelpButton: React.FC<NewHelpButtonProps> = ({ navigateToNewHelp }) => {
    return (
        <Container>
            <EmptySpace />
            <TouchableOpacity onPress={navigateToNewHelp}>
                <Ionicons name="md-add-circle" size={60} color="#4A89DC" />
            </TouchableOpacity>
        </Container>
    );
};

export default NewHelpButton;
