import React, { useContext, useState, useCallback } from 'react';

import { Alert, TouchableOpacity, View, Platform } from 'react-native';
import { fromUnixTime } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns-tz';
import { Container, Text, SelectorContainer, ActionText } from './styles';
import { formatFirstDateToFilter } from '../../utils/AppUtil';

const DateSelector: React.FC = () => {
    const [showFirstDate, setFirstDate] = useState(false);
    const [showSecondDate, setSecondDate] = useState(false);

    const today = new Date(Date.now());

    const todayFormatedToFilter = formatFirstDateToFilter(today);

    // const handleSetDateInThePicker = useCallback(
    //     (event, date, picker) => {
    //         if (event && event.nativeEvent && event.nativeEvent.timestamp) {
    //             const timestampLength = event.nativeEvent.timestamp.toString().length;
    //             const idealTimestampToBeConverted = event.nativeEvent.timestamp
    //                 .toString()
    //                 .slice(0, timestampLength - 3);

    //             picker === 'secondPicker'
    //                 ? handleSetFinalDate(fromUnixTime(idealTimestampToBeConverted))
    //                 : handleSetInitialDate(fromUnixTime(idealTimestampToBeConverted));

    //             if (picker === 'secondPicker') {
    //                 if (date < initialDate) {
    //                     Alert.alert('Data final anterior a data inicial, igualando ambas.');
    //                     handleSetInitialDate(fromUnixTime(idealTimestampToBeConverted));
    //                 }
    //             } else if (date > finalDate) {
    //                 Alert.alert('Data final anterior a data inicial, igualando ambas.');
    //                 handleSetFinalDate(fromUnixTime(idealTimestampToBeConverted));
    //             }
    //         }
    //     },
    //     [handleSetFinalDate, handleSetInitialDate, initialDate, finalDate],
    // );

    return (
        <Container>
            <SelectorContainer>
                {!showFirstDate && !showSecondDate && (
                    <TouchableOpacity onPress={() => setFirstDate(true)}>
                        <Text>Data inicial</Text>
                        <Text>
                            {format(today, 'dd/MM/yyyy', {
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
                            value={today}
                            mode="date"
                            is24Hour
                            display="calendar"
                            onChange={(event, date) => {
                                setFirstDate(false);
                                console.log('data escolhida: ', date);
                            }}
                        />
                    </View>
                )}
            </SelectorContainer>

            <SelectorContainer>
                {!showFirstDate && !showSecondDate && (
                    <TouchableOpacity onPress={() => setSecondDate(true)}>
                        <Text>Data final</Text>
                        <Text>
                            {format(today, 'dd/MM/yyyy', {
                                timeZone: 'America/Sao_Paulo',
                            })}
                        </Text>
                    </TouchableOpacity>
                )}

                {showSecondDate && (
                    <View style={{ marginTop: '60%', backgroundColor: 'white' }}>
                        {Platform.OS === 'ios' && (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setSecondDate(false)}>
                                    <ActionText>Cancelar</ActionText>
                                </TouchableOpacity>
                            </View>
                        )}
                        <DateTimePicker
                            value={today}
                            mode="date"
                            is24Hour
                            display="calendar"
                            onChange={(event, date) => {
                                setSecondDate(false);
                                console.log('data escolhida: ', date);
                            }}
                        />
                    </View>
                )}
            </SelectorContainer>
        </Container>
    );
};

export default DateSelector;
