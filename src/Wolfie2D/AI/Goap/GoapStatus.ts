import Actor from "../../DataTypes/Interfaces/Actor";

/**
 * Basically a glorified function call.
 */
export default abstract class GoapStatus {
     
    protected readonly _key: string;

    constructor(key: string) {
        this._key = key;
    }

    public get key(): string { return this._key; }

    abstract checkProceduralPreconditions(actor: Actor): boolean;
}