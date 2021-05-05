export interface Serializable {
    serialize(): SerializableObject;
}

export interface SerializableObject {
    [key: string]: SerializableValue | SerializableValue[] | SerializableObject | SerializableObject[]
}

type SerializableValue = string | number | boolean | null;
