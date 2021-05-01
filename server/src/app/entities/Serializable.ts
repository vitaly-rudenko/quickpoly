type SerializableValue = string | number | boolean | null;

export interface SerializableObject {
    [key: string]: SerializableValue | SerializableValue[] | SerializableObject | SerializableObject[]
}

export interface Serializable {
    serialize(): SerializableObject;
}
