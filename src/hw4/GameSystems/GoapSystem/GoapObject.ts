import Stack from "../../../Wolfie2D/DataTypes/Collections/Stack";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import { Debugger } from "../../Debugger";
import GoapAction, { GoapActionStatus } from "./GoapAction";
import GoapPlanner from "./GoapPlanner"
import GoapStatusSet from "./GoapStatusSet";
import GoapActionSet from "./GoapActionSet";

export default class GoapObject<E extends AI, T extends GoapAction> {

    protected _goal: string;
    protected _statuses: GoapStatusSet<E>;
    protected _actions: GoapActionSet<E, T>;
    protected _plan: Stack<T>;

    protected _parent: E | null;
    protected _action: T | null;

    public constructor(goal: string, status: GoapStatusSet<E>, actions: GoapActionSet<E, T>) {
        this._goal = goal;
        this._statuses = status;
        this._actions = actions;
        this._plan = new Stack<T>();

        this._parent = null;
        this._action = null;
    }

    public initialize(parent: E) { 
        this._parent = parent;
        this._statuses.initialize(parent);
        this._actions.initialize(parent);
     }

    public update(deltaT: number): void {
        if (this._plan.isEmpty()) {
            this._statuses.update();
            this._actions.update();
            this._plan = GoapPlanner.plan<T>(this._parent, Array.from(this.statuses()), this.goal, Array.from(this.actions()));
            this._action = this._plan.peek();
            this._action.reset(this._parent);
        }

        let actionStatus: GoapActionStatus = this._action.performAction(this._parent);

        switch(actionStatus) {
            case GoapActionStatus.SUCCESS: {
                this._action.effects.forEach((effect: string) => this._statuses.add(effect));
                this._plan.pop();
                if (!this._plan.isEmpty()) {
                    this._action = this._plan.peek();
                    this._action.reset(this._parent);
                }
                break;
            }
            case GoapActionStatus.FAILURE: {
                this._plan.clear();
                break;
            }
            case GoapActionStatus.RUNNING: {
                break;
            }
        }
    }

    public restart(): void {
        this._plan.clear();
    }

    get goal(): string { return this._goal; }
    statuses(): IterableIterator<string> { return this._statuses.status(); }
    actions(): IterableIterator<T> { return this._actions.actions(); }
}