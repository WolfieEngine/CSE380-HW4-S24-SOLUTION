import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";

export default class GoapStatusSet<T extends AI> {
    
    protected _statuses: Map<string, (obj: T) => boolean>;
    protected _status: Set<string>;
    protected _parent: T | null;

    constructor() {
        this._statuses = new Map<string, (obj: T) => boolean>();
        this._status = new Set<string>();
        this._parent = null;
    }
    initialize(parent: T): void { 
        this._parent = parent; 
    }
    add(status: string): void {
        this._status.add(status);
    }
    delete(status: string): void {
        this._status.delete(status);
    }
    status(): IterableIterator<string> { 
        return this._status.values(); 
    }
    update(): void { 
        if (this._parent !== null) {
            for (let status of this._statuses.keys()) {
                this._statuses.get(status)(this._parent) ? this.add(status) : this.delete(status);
            }
        }
    }
    subscribe(status: string, func: (object: T) => boolean): void {
        this._statuses.set(status, func);
    }
}