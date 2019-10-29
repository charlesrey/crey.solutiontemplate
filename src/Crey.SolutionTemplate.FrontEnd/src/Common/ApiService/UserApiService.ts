import { IsEntityWithId, IUser, NewEntityWithId } from "Common/Models";

import { BaseApiService } from "./BaseApiService";

export class UserApiService extends BaseApiService {
    private static Url: string = "User";

    public UserInfo(): Promise<IUser> {
        return this.Fetch(this.BuildApiUrl(UserApiService.Url));
    }

    public Get(): Promise<IUser[]> {
        return this.Fetch(this.BuildApiUrl(UserApiService.Url, "users"));
    }

    public Save(user: IUser | NewEntityWithId<IUser>): Promise<IUser> {
        return this.Fetch(
            IsEntityWithId(user) ? this.BuildApiUrl(UserApiService.Url, user.Id) : this.BuildApiUrl(UserApiService.Url),
            {
                body: JSON.stringify(user),
                method: IsEntityWithId(user) ? "PUT" : "POST",
            });
    }

    public Delete(id: string): Promise<void> {
        return this.Fetch(this.BuildApiUrl(UserApiService.Url, id), { method: "DELETE" });
    }

    public AskResetPassword(mail: string): Promise<void> {
        return fetch(
            this.BuildApiUrl(UserApiService.Url, "AskReset"),
            {
                body: `Mail=${mail}`,
                headers: [
                    ["content-type", "application/x-www-form-urlencoded"],
                    ["Accept-Language", this.Language],
                ],
                method: "POST",
            })
            .then<void>(
                (response) => {
                    if (response.status === 204) {
                        return;
                    }
                    else {
                        throw new Error(response.statusText);
                    }
                });
    }

    public ResetPassword(mail: string, token: string): Promise<void> {
        return fetch(
            this.BuildApiUrl(UserApiService.Url, "PerformReset"),
            {
                body: `Password=${mail}&Token=${token}`,
                headers: [
                    ["content-type", "application/x-www-form-urlencoded"],
                    ["Accept-Language", this.Language],
                ],
                method: "POST",
            })
            .then<void>(
                (response) => {
                    if (response.status === 204) {
                        return;
                    }
                    else {
                        throw new Error(response.statusText);
                    }
                });
    }
}
