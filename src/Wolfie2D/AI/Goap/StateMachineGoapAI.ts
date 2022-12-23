import Stack from "../../DataTypes/Collections/Stack";
import GoapAction from "./GoapAction";
import GoapActionPlanner from "./GoapActionPlanner"
import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import AI from "../../DataTypes/Interfaces/AI";
import Actor from "../../DataTypes/Interfaces/Actor";
import GoapStatus from "./GoapStatus";
import StateMachineAI from "../StateMachineAI";

/**
 * An implementation of basic Goap behavior.
 * 
 * GOAP requires a lot of overhead for managing all of the symbols (statuses and goals), the
 * actual goap-actions, and creating the action plans. 
 * 
 * Something I'd like to add is an additional class for managing a set of goals. The goals 
 * are pretty similar to statuses, except that goals have some kind off priority associated
 * with them. Not sure how we'd do this.
 * 
 * @author Peter Walsh
 */
export default class StateMachineGoapAI<T extends GoapAction> extends StateMachineAI {

    /** The parent Actor of this GoapAI */
    protected owner: GameNode | null;

    /** The goal/status we're trying to reach */
    protected _goal: GoapStatus;

    /** All statuses for this GoapAI */
    protected _statuses: Map<string, GoapStatus>
    /** All actions for this GoapAI */
    protected _actions: Map<string, T>

    /** The current action we're trying to perfrom */
    protected _currentAction: T | null;

    /** A Stack of GoapActions representing this goap objects current plan */
    protected _plan: Stack<T>;

    public constructor() {
        super();
        this._statuses = new Map<string, GoapStatus>();
        this._actions = new Map<string, T>();
        this._plan = new Stack<T>();
        this._goal = null;
    }

    public getOwner(): GameNode { return this.owner; }

    public initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    // Checks if the owner has reached their goal
    public goalReached(): boolean {
        return this._goal.checkProceduralPreconditions(this.owner);
    }

    public buildPlan(): Stack<T> {
        // Get all the current statuses
        let statuses = Array.from(this._statuses.values()).filter(stat => stat.checkProceduralPreconditions(this.owner)).map(stat => stat.key);
        // Get all the current actions
        let actions = Array.from(this._actions.values());
        // Create the plan
        return GoapActionPlanner.plan<T>(statuses, this._goal.key, actions);
    }

    public setPlan(plan: Stack<T>): void { this._plan = plan; }
    public getPlan(): Stack<T> { return this._plan; }

}