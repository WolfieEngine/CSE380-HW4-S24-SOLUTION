import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import GoapAction from "./GoapAction";

export default class GoapActionSet<E extends AI, T extends GoapAction> {

    protected _parent: E;
    protected _actions: Set<T>;

    constructor() {
        this._actions = new Set<T>();
    }
    initialize(parent: E): void {
        this._parent = parent;
    }
    add(action: T): void {
        this._actions.add(action);
    }
    delete(action: T): void {
        this._actions.delete(action);
    }
    update(): void {
        if (this._parent !== null) {
            for (let action of this._actions) {
                action.update(this._parent);
            }
        }
    }
    actions(): IterableIterator<T> { 
        return this._actions.values(); 
    }

}