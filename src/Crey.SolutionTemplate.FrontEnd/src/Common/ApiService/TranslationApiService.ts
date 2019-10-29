import { BaseApiService } from "Common/ApiService/BaseApiService";
import { ITranslation, ITranslationTransfer, Lang, Part } from "Common/Translations";

export class TranslationApiService extends BaseApiService {

    private static StoreKey = "Translations";

    private static Url = "Translation";

    public GetTranslation<P extends Part, T extends ITranslation<P>>(name: P, lang: Lang)
        : Promise<ITranslationTransfer<P, T>> {
        const local = this.GetLocalTranslation<P, T>(name, lang);
        return fetch(
            this.BuildApiUrl(
                TranslationApiService.Url,
                lang,
                name,
                local ? local.TimeStamp.toString() : "0"))
            .then<ITranslationTransfer<P, T>>(
                (response) => {
                    if (response.status === 304) {
                        return new Promise<ITranslationTransfer<P, T>>((resolve) => resolve(local));
                    }
                    else {
                        return response.json().then((newTranslation: ITranslationTransfer<P, T>) => {
                            this.StoreTranslation(newTranslation);
                            return newTranslation;
                        });
                    }
                });
    }

    private GetLocalTranslation<P extends Part, T extends ITranslation<P>>(name: Part, lang: Lang): ITranslationTransfer<P, T> | undefined {
        const local = localStorage.getItem(`${TranslationApiService.StoreKey}_${lang}_${name}`);
        if (local) {
            return JSON.parse(local) as ITranslationTransfer<P, T>;
        }
        else {
            return undefined;
        }
    }

    private StoreTranslation<P extends Part, T extends ITranslation<P>>(translation: ITranslationTransfer<P, T>):
        void {
        localStorage.setItem(
            `${TranslationApiService.StoreKey}_${translation.Lang}_${translation.Translation.Part}`,
            JSON.stringify(translation));
    }
}
