import { ITranslation, Part } from "./ITranslation";

export type Language = "fr-CH" | "de-CH";

export interface ITranslationTransfer<P extends Part, T extends ITranslation<P>> {
    TimeStamp: number;
    Lang: Language;
    Translation: T;
}
