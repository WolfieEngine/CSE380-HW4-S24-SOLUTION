import GoapAction, { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";

/**
 * An abstract GoapAction for an NPCGoapAI
 */
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
    
    /**
     * Checks the current status of the NPCGoapAI against this actions preconditions
     * @param ai the NPCGoapAI that will be performing the action
     * @param statuses the status of the NPCGoapAI
     * @returns true if the NPC satisfies the preconditions to perform the action; false otherwise
     */
    public checkPreconditions(ai: NPCGoapAI, statuses: string[]): boolean { 
        return this.preconditions.every(status => statuses.includes(status));
    }

    /** Getters and setters for the cost, preconditions, and effects */

    public get cost(): number { return this._cost; }
    public get preconditions(): string[] { return this._preconditions; }
    public get effects(): string[] { return this._effects; }
    public set cost(cost: number) { this._cost = cost; }
    public set preconditions(preconditions: string[]) { this._preconditions = preconditions; }
    public set effects(effects: string[]) { this._effects = effects; }
    
}
