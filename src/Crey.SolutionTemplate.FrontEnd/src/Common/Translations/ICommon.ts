import { ITranslation, Part } from "./ITranslation";

export interface ICommon extends ITranslation<Part.Common> {
    Part: Part.Common;
    Title: string;
    Error: string;
    Hello: string;
    MainTitle: string;
    Welcome: string;
    Users: string;
    About: string;
    Loading: string;
    Save: string;
    Close: string;
    SaveAndClose: string;
    Mail: string;
    MailRequired: string;
    MailAlreadyExists: string,
    Phone: string;
    PhoneRequired: string;
    Address: string;
    AddressRequired: string;
    LastName: string;
    LastNameRequired: string;
    FirstName: string;
    FirstNameRequired: string;
    Name: string;
    MyProfile: string;
    Logout: string;
    Favorites: string;
    History: string;
    NextStep: string;
    PreviousStep: string;
}
