export const cpfPattern = {
    Regex: /^(\d{3})(\d{3})(\d{3})(\d{2})/,
    Mask: '$1.$2.$3-$4',
};

export const phonePattern = {
    Regex: /^(\d{4})(\d{4})/,
    Mask: '$1-$2',
};

export const phonePatternExtraDigit = {
    Regex: /^(\d{5})(\d{4})/,
    Mask: '$1-$2',
};

export const phonePatternCountry = {
    Regex: /^(\d{2})(\d{2})(\d{4})(\d{4})/,
    Mask: '$1 ($2) $3-$4',
};

export const phonePatternCountryExtraDigit = {
    Regex: /^(\d{2})(\d{2})(\d{5})(\d{4})/,
    Mask: '$1 ($2) $3-$4',
};

export const cepPattern = {
    Regex: /^(\d{2})(\d{3})(\d{3})/,
    Mask: '$1.$2-$3',
};

export const hourPattern = {
    Regex: /^(\d{2})(\d{2})/,
    Mask: '$1:$2',
};
