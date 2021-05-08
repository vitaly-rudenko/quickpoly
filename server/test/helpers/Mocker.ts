import { DeepPartial } from 'ts-essentials';

export class Mocker {
    private _factories = new Map<ClassType, Factory<ClassType>>();
    private _indexes = new Map<ClassType, number>();
    private _instances = new Map<ClassType, InstanceType<ClassType>>();

    register<T extends ClassType>(Class: T, factory: Factory<T>): void {
        this._factories.set(Class, factory);
    }

    create<T extends ClassType>(Class: T, ...args: DeepPartial<ConstructorParameters<T>>): InstanceType<T> {
        const factory = this._factories.get(Class);
        const index = this._indexes.get(Class) ?? 0;
        this._indexes.set(Class, index + 1);

        const instance = factory ? factory({ index }, ...args) : new Class(...args);
        this._instances.set(Class, instance);

        return instance;
    }

    reuse<T extends ClassType>(Class: T): InstanceType<T> {
        return this._instances.get(Class);
    }
}

type Factory<T extends ClassType> = (
    context: { index: number },
    ...args: PartialArguments<ConstructorParameters<T>>
) => InstanceType<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassType = { new(...args: any[]): any };

type PartialArguments<T extends Array<U>, U = unknown> = Array<PartialArgument<T[number]>>;
type PartialArgument<T> = T extends Record<string, unknown>
    ? { [K in keyof T]?: PartialArgument<T[K]> }
    : T;
