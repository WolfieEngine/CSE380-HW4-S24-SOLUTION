import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import GoapAI from "../../Wolfie2D/DataTypes/Interfaces/GoapAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import NPCBattler from "../GameSystems/BattleSystem/Battlers/NPCBattler";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Items/Item";
import NPCAction from "./NPCActions/NPCAction";
import Animating from "./NPCStates/Animating";
import Moving from "./NPCStates/Moving";
import { NPCStateType } from "./NPCStates/NPCState";

/**
 * An implementation of an AI that uses goal-oriented-action-planning (GOAP). I have made this AI based on the
 * description of the GOAP AI Jeff Orkins describes in his paper reflecting on the use of GOAP AI in F.E.A.R.
 */
export default class NPCGoapAI extends StateMachineAI implements GoapAI {

    public owner: GameNode;

    public goal: string;
    protected _currentStatus: Set<string>;
    public possibleActions: NPCAction[];
    public plan: Stack<NPCAction>;
    public planner: GoapActionPlanner<NPCAction>;
    
    public battler: NPCBattler;
    public inventory: Inventory;
    public item: Item | null;

    initializeAI(owner: GameNode, opts: Record<string, any>): void {
        this.owner = owner;
        this.battler = opts.battler;
        this.inventory = opts.inventory;
        this.item = null;

        this.goal = "";
        this.currentStatus = [];
        this.possibleActions = [];
        this.plan = null;
        this.planner = new GoapActionPlanner<NPCAction>();
        
        this.addState(NPCStateType.ANIMATING, new Animating(this));
        this.addState(NPCStateType.MOVING, new Moving(this));
        this.initialize(NPCStateType.ANIMATING, {});
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
    activate(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }

    /**
     * The handleEvent() method of the NPCGoapAI calls the super.handleEvent() method, delegating the
     * handling of events to the current State of this StateMachineAI.
     * @param event 
     */
    handleEvent(event: GameEvent): void {
        super.handleEvent(event);
    }

    /**
     * First, the update method makes a call to super.update(). Calling the super.update() method will
     * trigger the current state of the AIs StateMachine to update.
     * 
     * Next, the update method attempts to perform the next action in the Goap AIs plan. If the plan is 
     * empty, a new plan is created.
     * 
     * If the action the AI attempts to perform is successful, the AI will add the effects of successfully
     * performing the action to the AIs current statuses and pop the action from it's current action plan.
     * 
     * @param deltaT the amount of time elapsed since the last update cycle
     */
    update(deltaT: number): void {
        super.update(deltaT);

        // if (this.plan.isEmpty()) {
        //     this.plan = this.planner.plan(this.goal, this.possibleActions, this.currentStatus);
        // }

        // let action: NPCAction = this.plan.peek();
        // let result: string[] = action.performAction(this.currentStatus, this, deltaT);

        // if (result === null || !action.loopAction) { this.plan.pop(); }
        // else if (result.length !== 0) { result.forEach(status => this._currentStatus.add(status)); }
    }

    public move(dest: Vec2, rng: number): void {
        let move: Moving = <Moving>this.stateMap.get(NPCStateType.MOVING);
        if (move !== undefined) {
            move.pos.copy(dest);
            move.rng = rng;
            if (this.currentState.constructor !== Moving) {
                this.changeState(NPCStateType.MOVING);
            }
        } 
    }

    public get currentStatus(): string[] { return Array.from(this._currentStatus); }
    public set currentStatus(currentStatus: string[]) { 
        if (this._currentStatus === undefined) {
            this._currentStatus = new Set<string>();
        }
        this._currentStatus.clear(); 
        currentStatus.forEach(status => this._currentStatus.add(status));
    }
}