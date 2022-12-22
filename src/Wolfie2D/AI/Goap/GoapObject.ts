import Stack from "../../DataTypes/Collections/Stack";
import AI from "../../DataTypes/Interfaces/AI";
import GoapAction, { GoapActionStatus } from "../../../Wolfie2D/DataTypes/Goap/GoapAction";
import GoapActionPlanner from "./GoapActionPlanner"
import GoapStatusSet from "./GoapStatusSet";
import GoapActionSet from "./GoapActionSet";

/**
 * A GoapObject used to abstract away the guts of managing GOAP. 
 * 
 * GOAP requires a lot of overhead for managing all of the symbols (statuses and goals), the
 * actual goap-actions, and creating the action plans. 
 */
export default class GoapObject<E extends AI, T extends GoapAction> {

    /** The goal/status we're trying to reach */
    protected _goal: string;
    /** The current set of statuses for this Goap object */
    protected _statuses: GoapStatusSet<E>;
    /** The current set of available actions for this Goap object */
    protected _actions: GoapActionSet<E, T>;
    /** A Stack of GoapActions representing this goap objects current plan */
    protected _plan: Stack<T>;
    /** The current action the goap object is trying to perform */
    protected _action: T | null;

    /** The parent AI of this goap object - should be an Actor... */
    protected _parent: E | null;

    public constructor(goal: string, status: GoapStatusSet<E>, actions: GoapActionSet<E, T>) {
        this._goal = goal;
        this._statuses = status;
        this._actions = actions;
        this._plan = new Stack<T>();

        this._parent = null;
        this._action = null;
    }

    /**
     * Initializes this goap object with a parent AI
     * @param parent the AI this
     */
    public initialize(parent: E) { 
        this._parent = parent;
        this._statuses.initialize(parent);
        this._actions.initialize(parent);
    }

    /**
     * Gets a new plan for this goap object
     */
    public getNewPlan(): void { 
        // Update the statuses
        this._statuses.update();
        // Update the actions
        this._actions.update();

        // Create a new plan
        this._plan = GoapActionPlanner.plan<T>(this._parent, Array.from(this.statuses), this.goal, Array.from(this.actions));

        // Initialize the current action to the first action in the plan 
        this._action = this._plan.peek();
        this._action.reset(this._parent);
    }

    public get goal(): string { return this._goal; }
    public get statuses(): IterableIterator<string> { return this._statuses.status(); }
    public get actions(): IterableIterator<T> { return this._actions.actions(); }

    public update(deltaT: number): void {
        // If we don't have a plan - get a new plan
        if (this._plan.isEmpty()) {
            this.getNewPlan();
        }

        // Try to perform the current action 
        let actionStatus: GoapActionStatus = this._action.performAction(this._parent);

        // Handles each of the statuses
        switch(actionStatus) {
            case GoapActionStatus.SUCCESS: {
                this.handleSuccess();
                break;
            }
            case GoapActionStatus.FAILURE: {
                this.handleFailure();
                break;
            }
            case GoapActionStatus.RUNNING: {
                this.handleRunning();
                break;
            }
            default: {
                throw new Error(`Unrecognized action status ${actionStatus}`);
            }
        }
    }

    /** 
     * Handles when an action finishes successfully 
     */
    protected handleSuccess(): void {
        // Add the effects 
        this._action.effects.forEach((effect: string) => this._statuses.add(effect));
        // Remove the previous action from the plan
        this._plan.pop();

        // If there's another action in the plan, get the next action 
        if (!this._plan.isEmpty()) {
            this._action = this._plan.peek();
            this._action.reset(this._parent);
        }
    }
    /**
     * Handles when an action fails
     */
    protected handleFailure(): void {
        this._plan.clear();
    }
    /**
     * Handles the case when the current actions hasn't finished yet
     */
    protected handleRunning(): void {
        // Do nothing
    }

    
}