import Actor from "../../DataTypes/Interfaces/Actor";
import Vec2 from "../../DataTypes/Vec2";
import GameNode from "../../Nodes/GameNode";
import GoapStatus from "./GoapStatus";

export default abstract class GoapAction {

    protected _key: string;

    protected _preconditions: Set<string>;
    protected _effects: Set<string>;
    protected _cost: number;
    protected _target: Vec2;
    protected _range: number;

    public constructor(key: string) {
        this._key = key;
        this._preconditions = new Set<string>();
        this._effects = new Set<string>();
        this._cost = 0;
        this._target = Vec2.ZERO;
        this._range = Number.POSITIVE_INFINITY;
    }

    get key(): string { return this._key; }

    /** Cost it takes to complete this action */
    get cost(): number { return this._cost; }
    set cost(cost: number) { this._cost = cost; }

    /** Preconditions that have to be satisfied for an action to happen */
    get preconditions(): string[] { return Array.from(this._preconditions.values()); };

    /** Resulting statuses after this action completes */
    get effects(): string[] { return Array.from(this._effects.values()); }

    /** Called when this action starts being performed */
    public abstract onStart(actor: GameNode): void;

    /** Performs the GoapAction on the given actor */
    public abstract performAction(actor: GameNode): GoapActionStatus;

    /** Called after performAction returns success or failture */
    public abstract onEnd(actor: GameNode): void;

    /** Gets the location where this actor should be before performing the action */
    public get target(): Vec2 { return this._target; }
    protected set target(target: Vec2) { this._target = target; }

    /** Gets the distance this actor should be from the target location */
    public get range(): number { return this._range; }
    protected set range(value: number) { this._range = value; }

    public checkPreconditions(status: string[]): boolean {
        return Array.from(this._preconditions.values()).every(precondition => status.includes(precondition));
    }

    public addPrecondition(status: string): void {
        this._preconditions.add(status);
    }
    public addEffect(status: string): void {
        this._effects.add(status);
    }

}

export enum GoapActionStatus {
    FAILURE = 0,
    SUCCESS = 1,
    RUNNING = 2
}