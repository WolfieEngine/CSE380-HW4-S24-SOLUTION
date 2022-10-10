import GoapActionPlanner from "../../../Wolfie2D/AI/GoapActionPlanner";
import Stack from "../../../Wolfie2D/DataTypes/Collections/Stack";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import NPCAction from "../NPCActions/NPCAction";
import GoapAction, { GoapActionStatus } from "./GoapAction";
import GoapPlanner from "./GoapPlanner";

export default class GoapAI<T extends GoapAction<Record<string, any>>> implements Updateable {

    protected _ai: AI | null;

    protected _goal: string;
    protected _status: Set<string>;

    protected _action: T;
    protected _actions: Set<T>

    protected _plan: Stack<T>

    constructor(goal: string, status: string[], actions: T[]) {
        this._ai = null;

        this._goal = goal;
        this._status = new Set<string>();
        status.forEach(status => this._status.add(status));

        this._actions = new Set<T>();
        actions.forEach(status => this._actions.add(status));

        this._plan = new Stack<T>();
    }

    initialize(ai: AI) {
        this._ai = ai;
    }

    update(deltaT: number): void {
        if (this._plan.isEmpty()) {
            this._plan = GoapPlanner.plan<T>(this._ai, this.status, this.goal, this.actions);
            this._action = this._plan.peek();
            this._action.start(this._ai);
        }

        let status: GoapActionStatus = this._action.run(this._ai);

        switch(status) {
            case GoapActionStatus.SUCCESS: {
                this._action.effects.forEach((effect: string) => this._status.add(effect));
                this._plan.pop();
                this._action.stop(this._ai);
                if (!this._plan.isEmpty()) {
                    this._action = this._plan.peek();
                    this._action.start(this._ai);
                }
                break;
            }
            case GoapActionStatus.FAILURE: {
                this._action.stop(this._ai);
                this._plan.clear();
                break;
            }
            case GoapActionStatus.RUNNING: {
                break;
            }
        }
        
    }

    get goal(): string { return this._goal; }
    get actions(): T[] { return Array.from(this._actions.values()); }
    get status(): string[] { return Array.from(this._status.values()); }

    addStatus(status: string): void { this._status.add(status); }
    deleteStatus(status: string): void { this._status.delete(status); }

}