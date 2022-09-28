import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import GoapAI from "../../../Wolfie2D/DataTypes/Interfaces/GoapAI";
import NPCGoapAI from "../NPCGoapAI";

export default abstract class NPCAction implements GoapAction {

    protected _cost: number;
    protected _preconditions: string[];
    protected _effects: string[];
    protected _loopAction: boolean;

    public constructor(cost: number = 1, preconditions: string[] = [], effects: string[] = [], loopAction: boolean = false) {
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
        this.loopAction = loopAction;
    }

    public abstract performAction(statuses: string[], actor: NPCGoapAI, deltaT: number): string[];

    public checkPreconditions(statuses: string[]): boolean { 
        return this.preconditions.every(status => statuses.includes(status));
    }

    public get cost(): number { return this._cost; }
    public get preconditions(): string[] { return this._preconditions; }
    public get effects(): string[] { return this._effects; }
    public get loopAction(): boolean { return this._loopAction; }

    protected set cost(cost: number) { this.cost = cost; }
    protected set preconditions(preconditions: string[]) { this.preconditions = preconditions; }
    protected set effects(effects: string[]) { this.effects = effects; }
    protected set loopAction(loopAction: boolean) { this.loopAction = loopAction; }
    
}
