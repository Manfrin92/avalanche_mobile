import React, { useState, useCallback, useEffect } from 'react';

import { TouchableOpacity, View, Platform } from 'react-native';
import { fromUnixTime } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns-tz';
import { Container, Text, SelectorContainer, ActionText } from './styles';

interface DateSelectorData {
    setChosenDate(date: Date): void;
    initialDate?: Date;
}

const DateSelector: React.FC<DateSelectorData> = ({ setChosenDate, initialDate }) => {
    const today = new Date(Date.now());
    const [showFirstDate, setFirstDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate || today);

    const handleSetDateInThePicker = useCallback((event, date) => {
        if (event && event.nativeEvent && event.nativeEvent.timestamp) {
            const timestampLength = event.nativeEvent.timestamp.toString().length;
            const idealTimestampToBeConverted = event.nativeEvent.timestamp
                .toString()
                .slice(0, timestampLength - 3);

            setSelectedDate(fromUnixTime(idealTimestampToBeConverted));
            setChosenDate(fromUnixTime(idealTimestampToBeConverted));
        }
    }, []);

    useEffect(() => {
        setChosenDate(initialDate || today);
    }, []);

    return (
        <Container>
            <SelectorContainer>
                {!showFirstDate && (
                    <TouchableOpacity onPress={() => setFirstDate(true)}>
                        <Text>Data da ajuda</Text>
                        <Text>
                            {format(selectedDate, 'dd/MM/yyyy', {
                                timeZone: 'America/Sao_Paulo',
                            })}
                        </Text>
                    </TouchableOpacity>
                )}

                {showFirstDate && (
                    <View
                        style={{
                            marginBottom: '10%',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        {Platform.OS === 'ios' && (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setFirstDate(false)}>
                                    <ActionText>Cancelar</ActionText>
                                </TouchableOpacity>
                            </View>
                        )}
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            is24Hour
                            display="calendar"
                            onChange={(event, date) => {
                                setFirstDate(false);
                                handleSetDateInThePicker(event, date);
                            }}
                        />
                    </View>
                )}
            </SelectorContainer>
        </Container>
    );
};

export default DateSelector;
