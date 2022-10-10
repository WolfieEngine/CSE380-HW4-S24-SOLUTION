import GoapAction, { GoapActionStatus } from "../Goap/GoapAction"
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import NPCGoapAI from "../NPCGoapAI";

export default abstract class NPCAction<T extends Record<string, any>> implements GoapAction<T> {

    protected _cost: number;
    protected _preconditions: string[];
    protected _effects: string[];

    public constructor(cost: number = 1, preconditions: string[] = [], effects: string[] = []) {
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    abstract init(options: T): void;
    abstract start(ai: NPCGoapAI): void;
    abstract run(ai: NPCGoapAI): GoapActionStatus;
    abstract stop(ai: NPCGoapAI): void;
    abstract checkProceduralPreconditions(ai: NPCGoapAI): boolean;

    public checkPreconditions(ai: NPCGoapAI, statuses: string[]): boolean { 
        return this.preconditions.every(status => statuses.includes(status)) && this.checkProceduralPreconditions(ai);
    }

    public get cost(): number { return this._cost; }
    public get preconditions(): string[] { return this._preconditions; }
    public get effects(): string[] { return this._effects; }

    protected set cost(cost: number) { this._cost = cost; }
    protected set preconditions(preconditions: string[]) { this._preconditions = preconditions; }
    protected set effects(effects: string[]) { this._effects = effects; }
    
}
