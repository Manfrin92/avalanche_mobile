import React from 'react';

import { Container, OutsideCircle, InsideCircle, Text, TouchableOption } from './styles';

interface SelectorProps {
    id: string;
    selected: boolean;
    needyName: string;
    handleNeedySelected?(): void;
}

const NeedySelector: React.FC<SelectorProps> = ({ selected, needyName, handleNeedySelected, id, ...rest }) => {
    return (
        <Container {...rest} id={id}>
            <TouchableOption onPress={handleNeedySelected}>
                <OutsideCircle>{selected && <InsideCircle />}</OutsideCircle>
                <Text>{needyName}</Text>
            </TouchableOption>
        </Container>
    );
};

export default NeedySelector;
