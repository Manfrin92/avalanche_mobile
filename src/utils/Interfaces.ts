export interface UserData {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressCity: string;
    addressState: string;
    addressComplement: string;
    addressArea: string;
    addressCountry: string;
}

export interface FirstFormData {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
}

export interface SecondFormData {
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement: string;
    addressArea: string;
    addressCity: string;
    addressState: string;
}

export interface AddressFromURL {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}
