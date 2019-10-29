import { Map } from "immutable";

export interface IEntityWithId {
    Id: string;
}

export type NewEntityWithId<T extends IEntityWithId> = Omit<T, keyof IEntityWithId>;

export const ToMap = <TEntityWithId extends IEntityWithId>(entities: TEntityWithId[]) => {
    let result = Map<string, TEntityWithId>();
    entities.forEach((value) => result = result.set(value.Id, value));
    return result;
};

export const IsEntityWithId =
    <TEntityWithId extends IEntityWithId>(entity: TEntityWithId | NewEntityWithId<TEntityWithId>): entity is TEntityWithId => {
        return entity.hasOwnProperty("Id") !== undefined;
};
