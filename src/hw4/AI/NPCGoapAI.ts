import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import { BattlerEvent, HudEvent, ItemEvent } from "../Events";
import NPCBattler from "../GameSystems/BattleSystem/Battlers/NPCBattler";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Consumable from "../GameSystems/ItemSystem/Items/Consumable";
import Item from "../GameSystems/ItemSystem/Items/Item";
import Weapon from "../GameSystems/ItemSystem/Items/Weapon";
import GoapPlan from "./Goap/GoapPlan";
import GotoPlayer from "./NPCActions/GotoPlayer";
import NPCAction from "./NPCActions/NPCAction";

export default class NPCGoapAI implements AI {

    public owner: GameNode;
    protected goap: GoapPlan<NPCAction<any>>;
    protected navkey: string;
    protected battler: NPCBattler;
    public inventory: Inventory;
    public item: Item | null;

    protected emitter: Emitter;

    initializeAI(owner: GameNode, opts: Record<string, any>): void {
        this.owner = owner;
        this.navkey = opts.navkey;
        this.battler = opts.battler;
        this.inventory = opts.inventory;

        this.goap = opts.goap;
        this.goap.initialize(this);

        this.item = null;
        this.emitter = new Emitter();
        
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
    activate(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }

    handleEvent(event: GameEvent): void {
        switch(event.type) {
            case BattlerEvent.BATTLER_CHANGE: {
                this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {
                    id: this.owner.id,
                    curhp: this.battler.health,
                    maxhp: this.battler.maxHealth 
                });
                break;
            }
            case ItemEvent.INVENTORY_CHANGED: {
                break;
            }
            case BattlerEvent.HIT: {
                this.battler.handleEvent(event);
                break;
            }
            case BattlerEvent.CONSUME: {
                this.battler.handleEvent(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event with type ${event.type} and data ${event.data} caught in NPC`);
            }
        }
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
    public update(deltaT: number): void {
        this.goap.update(deltaT);
    }

    /** GameNode interface */

    public get position(): Vec2 { return this.owner.position; }
    public get id(): number { return this.owner.id; }
    public getPath(to: Vec2): NavigationPath { return this.owner.getScene().getNavigationManager().getPath(this.navkey, this.owner.position, to, false); }
    public moveOnPath(speed: number, path: NavigationPath): void { this.owner.moveOnPath(speed, path); }

    /** Battler Interface */

    public get health(): number { return this.battler.health; }
    public get maxHealth(): number { return this.battler.maxHealth; }
    public get speed(): number { return this.battler.speed; }
    
}