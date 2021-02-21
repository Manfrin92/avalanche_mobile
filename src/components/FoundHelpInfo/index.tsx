import React, { useEffect, useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { format, getDate } from 'date-fns';
import { HelpDateFiltered } from '../../screens/FindHelp';
import {
    Container,
    DateContainer,
    DetailContainer,
    HelpDate,
    HelpWeekDate,
    Button,
    HelpTitle,
    ButtonText,
} from './styles';

interface FoundHelpProps extends HelpDateFiltered {
    onPress(): void;
}

const FoundHelpInfo: React.FC<FoundHelpProps> = ({ date, help, id, type, onPress }) => {
    const dayAndMonth = useMemo(() => format(new Date(date), 'dd/MM'), [date]);

    const weekDayInPt = useMemo(() => {
        const weekDay = getDate(new Date(date));

        switch (weekDay) {
            case 0:
                return 'Domingo';
            case 1:
                return 'Segunda-Feira';
            case 2:
                return 'Terça-Feira';
            case 3:
                return 'Quarta-Feira';
            case 4:
                return 'Quinta-Feira';
            case 5:
                return 'Sexta-Feira';
            case 6:
                return 'Sábado';
            default:
                return '';
        }
    }, [date]);

    return (
        <Container>
            <DateContainer>
                <HelpDate>{dayAndMonth}</HelpDate>
                <HelpWeekDate>{weekDayInPt}</HelpWeekDate>
            </DateContainer>
            <MaterialIcons
                style={{ marginLeft: '4%' }}
                name="airline-seat-individual-suite"
                size={40}
                color="black"
            />
            <DetailContainer>
                <HelpTitle>{type.name}</HelpTitle>
                <Button onPress={onPress}>
                    <ButtonText>Quero ser voluntário</ButtonText>
                </Button>
            </DetailContainer>
        </Container>
    );
};

export default FoundHelpInfo;
