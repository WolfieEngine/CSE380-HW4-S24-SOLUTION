import AI from "../../DataTypes/Interfaces/AI";
import GoapAction from "../../../Wolfie2D/DataTypes/Goap/GoapAction";

/**
 * A set of GoapActions for an AI. This is meant to be a support class for a GoapObject.
 * @param E the type of the parent AI for a GoapActionSet
 * @param T the type of the GoapActions in the GoapActionSet
 */
export default class GoapActionSet<E extends AI, T extends GoapAction> {

    /** The parent AI that owns this set of GoapActions */
    protected _parent: E;
    /** The set of GoapActions */
    protected _actions: Set<T>;

    public constructor() {
        this._actions = new Set<T>();
    }

    /**
     * Initializes this GoapActionSet with a parent AI
     * @param parent the parent AI that owns this set of GoapActions
     */
    public initialize(parent: E): void {
        this._parent = parent;
    }
    /**
     * Adds a goap action to the set of goap-actions.
     * @param action the goap action
     */
    public add(action: T): void {
        this._actions.add(action);
    }
    /**
     * Removes an action from the set of goap-actions.
     * @param action 
     */
    public delete(action: T): void {
        this._actions.delete(action);
    }
    /**
     * Updates each action in this set of goap actions. This is not the same as the
     * usual update(deltaT) method. This method is not guaranteed to be called each
     * frame.
     */
    public update(): void {
        if (this._parent !== null) {
            for (let action of this._actions) {
                action.update(this._parent);
            }
        }
    }
    /**
     * @returns an iterator over the actions in this set of goap actions
     */
    public actions(): IterableIterator<T> { 
        return this._actions.values(); 
    }
}