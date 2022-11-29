import AI from "../../DataTypes/Interfaces/AI";

/**
 * A set of statuses for a GoapObject. The GoapStatusSet is meant to help manage and maintain the set of
 * statuses associated with a GoapObject. The goal is to reduce some of the overheadd associated with
 * a GOAP system.
 */
export default class GoapStatusSet<T extends AI> {
    
    /** A mapping between status and their conditions */
    protected _statuses: Map<string, (obj: T) => boolean>;
    /** The current statuses of the GoapObject */
    protected _status: Set<string>;
    /** The parent AI associated with the main GoapObject - TODO should be an actor  */
    protected _parent: T | null;

    public constructor() {
        this._statuses = new Map<string, (obj: T) => boolean>();
        this._status = new Set<string>();
        this._parent = null;
    }

    /**
     * Initializes this GoapStatusSet with a parent AI
     * @param parent the parent AI 
     */
    public initialize(parent: T): void { 
        this._parent = parent; 
    }
    /**
     * Adds a status to the current set of statuses 
     * @param status the status to add
     */
    public add(status: string): void {
        this._status.add(status);
    }
    /**
     * Removes a status from the current set of statuses
     * @param status 
     */
    public delete(status: string): void {
        this._status.delete(status);
    }
    /**
     * @returns an interator over the statuses in the current set of statuses
     */
    public status(): IterableIterator<string> { 
        return this._status.values(); 
    }
    /**
     * Updates each of the statuses in the set of statuses, based on each statuses associated
     * predicate function. 
     * 
     * For each status, if the function associated with the status returns true, the status is 
     * added to the current set of statuses, if the function returns false, the status is removed
     * from the current set of statuses.
     */
    public update(): void { 
        if (this._parent !== null) {
            for (let status of this._statuses.keys()) {
                this._statuses.get(status)(this._parent) ? this.add(status) : this.delete(status);
            }
        }
    }
    /**
     * Maps a function to a callback function that determines whether or not the given status should
     * be addded or removed from the current set of statuses.
     * @param status the status
     * @param func the callback function
     */
    public subscribe(status: string, func: (object: T) => boolean): void {
        this._statuses.set(status, func);
    }
}