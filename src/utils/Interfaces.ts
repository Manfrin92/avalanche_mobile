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

export interface FirstFormUpdateData {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
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

export interface HelpData {
    name: string;
    email: string;
    title: string;
    description: string;
    observation?: string | null;
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressCity: string;
    addressState: string;
    addressComplement: string;
    addressArea: string;
    addressCountry: string;
    helpDateId: string;
    helpDate: Date;
}

export interface FirstFormHelpData {
    name: string;
    email: string;
    title: string;
    description: string;
    observation?: string | null;
}

export interface SecondFormHelpData {
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressCity: string;
    addressState: string;
    addressComplement: string;
    addressArea: string;
    addressCountry: string;
}

export interface HelpDataToShow {
    id: string;
    title: string;
    email?: string;
    title?: string;
    description?: string | null;
    observation?: string | null;
    addressZipCode?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressCity?: string;
    addressState?: string;
    addressComplement?: string;
    addressArea?: string;
    addressCountry?: string;
    helpDateId?: string;
    helpDate?: Date;
}
