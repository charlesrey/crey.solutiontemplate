import { Environment } from "Environment/Environment";
import { WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";

const BaseUrl: string = `wss://${Environment.backEndUrl}/websocket/`;

export abstract class BaseWebSocketService<T> {

    private readonly config: WebSocketSubjectConfig<T>;

    constructor(config: WebSocketSubjectConfig<T>) {
        this.config = {...config,  url: `${BaseUrl}${config.url}`};
    }

    public BuildSocket(urlComplement: string | undefined): WebSocketSubject<T> {
        const config = urlComplement ? {...this.config, url: `${this.config.url}/${urlComplement}`} : {...this.config};
        return new WebSocketSubject<T>(config);
    }
}
