import GoapAction, { GoapActionStatus } from "../../../GameSystems/GoapSystem/GoapAction"
import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import NPCGoapAI from "../NPCGoapAI";

export default abstract class NPCAction implements GoapAction {

    protected _cost: number;
    protected _preconditions: string[];
    protected _effects: string[];

    public constructor(cost: number = 1, preconditions: string[] = [], effects: string[] = []) {
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    abstract performAction(ai: NPCGoapAI): GoapActionStatus;
    abstract reset(ai: NPCGoapAI): void;
    abstract update(ai: NPCGoapAI): void;
    
    public checkPreconditions(ai: NPCGoapAI, statuses: string[]): boolean { 
        return this.preconditions.every(status => statuses.includes(status));
    }

    public get cost(): number { return this._cost; }
    public get preconditions(): string[] { return this._preconditions; }
    public get effects(): string[] { return this._effects; }
    public set cost(cost: number) { this._cost = cost; }
    public set preconditions(preconditions: string[]) { this._preconditions = preconditions; }
    public set effects(effects: string[]) { this._effects = effects; }
    
}
