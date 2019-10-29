import { IToken } from "Common/Models";
import { ILoginState } from "Components/Login/Models";
import { Environment } from "Environment/Environment";

// import fetchPonyfill from "fetch-ponyfill";

export class BaseApiService {

    private static TokenStorageKey = "token";

    private static Token?: IToken;

    protected Language: string;

    constructor(language: string) {
        this.Language = language;
        const tokenStored = localStorage.getItem(BaseApiService.TokenStorageKey);
        if (BaseApiService.Token || !tokenStored) {
            // Already loaded or not loadable
        } else {
            BaseApiService.Token = JSON.parse(tokenStored);
        }
    }

    public AuthenticateAsync(credentials: ILoginState | string): Promise<any> {
        const body: string = typeof credentials === "string"
            ? `grant_type=refresh_token&refresh_token=${credentials}`
            : `grant_type=password&username=${credentials.Username}&password=${credentials.Password}`;
        const query = new Request(
            `https://${Environment.backEndUrl}/connect/token`,
            {
                body,
                headers: [
                    ["content-type", "application/x-www-form-urlencoded"],
                ],
                method: "POST",
            });
        return fetch(query)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.ClearToken();
                    const error = new Error(typeof credentials === "string"
                        ? "Token expiré"
                        : "Utilisateur et/ou mot de passe invalide");
                    error.name = "401";
                    throw error;
                }
            })
            .then((token) => this.StoreToken(token));
    }

    public Logout(): void {
        this.ClearToken();
    }

    protected Fetch<T>(input: RequestInfo, init?: RequestInit, retry?: boolean): Promise<T> {
        const requestInitAdd: RequestInit = this.GetBaseOptions();
        if (init) {
            const headers: Headers = requestInitAdd.headers as Headers;
            if (init.headers) {
                const initHeaders: Headers = init.headers as Headers;
                initHeaders.forEach((value: string, name: string) => {
                    headers.set(name, value);
                });
            }
            requestInitAdd.headers = headers;
            requestInitAdd.body = init.body;
            requestInitAdd.method = init.method;
            if (typeof init.body === "string") {
                requestInitAdd.headers.append("Content-Type", "application/json");
            }
        }
        return fetch(input, requestInitAdd)
            .then((response) => {
                if (response.status === 200) {
                    return response.body === null
                        ? null
                        : response.json();
                }
                else if (response.status === 204) {
                    return undefined;
                }
                else if (response.status === 401
                    && !retry
                    && BaseApiService.Token
                    && BaseApiService.Token.refresh_token) {
                    return this.AuthenticateAsync(BaseApiService.Token.refresh_token)
                        .then((_response) => this.Fetch(input, init, true));
                }
                else {
                    /*const error = new Error(response.statusText);
                    error.name = "401";
                    throw error;*/
                    throw new Error(response.statusText);
                }
            });
    }

    protected BuildApiUrl(...path: string[]): string {
        return `https://${Environment.backEndUrl}${
            Environment.backEndUrl.endsWith("/") ? "" : "/"}api/${
            path.map((value) => encodeURIComponent(value)).join("/")}`;
    }

    protected GetBaseOptions(): RequestInit {
        return {
            headers: new Headers({
                "Accept": "application/json",
                "Accept-Language": this.Language,
                "Authorization": `Bearer ${BaseApiService.Token ? BaseApiService.Token.access_token : ""}`,
            }),
        };
    }

    private StoreToken(token: IToken): IToken {
        BaseApiService.Token = token;
        localStorage.setItem(BaseApiService.TokenStorageKey, JSON.stringify(token));
        return token;
    }

    private ClearToken(): void {
        BaseApiService.Token = undefined;
        localStorage.removeItem(BaseApiService.TokenStorageKey);
    }
}
