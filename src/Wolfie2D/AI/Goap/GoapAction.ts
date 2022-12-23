import Actor from "../../DataTypes/Interfaces/Actor";
import Vec2 from "../../DataTypes/Vec2";
import GameNode from "../../Nodes/GameNode";
import GoapStatus from "./GoapStatus";

export default abstract class GoapAction {

    protected _preconditions: Set<GoapStatus>;
    protected _effects: Set<GoapStatus>;
    protected _cost: number;

    protected _target: Vec2;
    protected _range: number;

    public constructor() {
        this._preconditions = new Set<GoapStatus>;
        this._effects = new Set<GoapStatus>;
        this._cost = 0;
        this._target = Vec2.ZERO;
        this._range = Number.POSITIVE_INFINITY;
    }

    /** Cost it takes to complete this action */
    get cost(): number { return this._cost; }

    /** Preconditions that have to be satisfied for an action to happen */
    get preconditions(): string[] { return Array.from(this._preconditions.values()).map(stat => stat.key); };

    /** Resulting statuses after this action completes */
    get effects(): string[] { return Array.from(this._effects.values()).map(stat => stat.key); }

    /** Performs the GoapAction on the given actor */
    public abstract performAction(actor: GameNode): GoapActionStatus;

    /** Plans the action */
    public abstract planAction(actor: GameNode): void;

    /** Gets the location where this actor should be before performing the action */
    public getTarget(actor: GameNode): Vec2 { return this._target; }

    /** Gets the distance this actor should be from the target location */
    public getRange(actor: GameNode): number { return this._range; }

    public checkPreconditions(status: string[]): boolean {
        return status.every(stat => Array.from(this._preconditions.values()).map(stat => stat.key).includes(stat));
    }
}

export enum GoapActionStatus {
    FAILURE = 0,
    SUCCESS = 1,
    RUNNING = 2
}