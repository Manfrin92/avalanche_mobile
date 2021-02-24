export interface UserData {
    name: string;
    email: string;
    cpf: string;
    ddd: string;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
    address: string;
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
    ddd: string;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
}

export interface FirstFormUpdateData {
    name: string;
    email: string;
    cpf: string;
    ddd: string;
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
    title: string;
    description: string;
    dateHour: string;
    helpedDateTypeId: string;
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
    helpDate: string;
    helpId: string;
    addressId: string;
}

export interface FirstFormHelpData {
    name: string;
    email: string;
    dddPhoneNumber: string;
    phoneNumber: string;
    title: string;
    description: string;
    dateHour: string;
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

export interface HelpDateDataToShow {
    id: string;
    date: string;
    help: {
        id: string;
        title: string;
        description: string;
        observation?: string | null;
        imageName?: string | null;
        userManager: UserManager;
        needy: Needy;
        address: Address;
    };
    type: Type;
    ExcludeHelp(): Promise<void>;
}

export interface UserManager {
    id: string;
    name: string;
    email: string;
    cpf: string;
    ddd: string;
    phoneNumber: string;
    address: Address;
}

export interface Address {
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement: string;
    addressArea: string;
    addressCity: string;
    addressState: string;
    addressCountry?: string;
    id?: string;
}

export interface Needy {
    id: string;
    name: string;
    email: string;
    showContact: boolean;
    ddd: string;
    phoneNumber: string;
}

export interface Type {
    id: string;
    name: string;
    groupName: string;
}
