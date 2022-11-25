import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent, NPCEvent } from "../../../Events";
import Battler from "../../../GameSystems/BattleSystem/Battlers/Battler";
import Item from "../../../GameSystems/ItemSystem/Items/Item";
import Weapon from "../../../GameSystems/ItemSystem/Items/Weapon";
import ConsumableType from "../../../GameSystems/ItemSystem/ItemTypes/ConsumableType";
import HealthPack from "../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import LaserGun from "../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import Wand from "../../../GameSystems/ItemSystem/ItemTypes/Wand";
import WeaponType from "../../../GameSystems/ItemSystem/ItemTypes/WeaponType";
import NPCGoapAI from "../NPCGoapAI";

/**
 * NPCs have two states - active and dead
 */
export enum NPCStateType {
    ACTIVE = "ACTIVE",
    DEAD = "DEAD"
}

/**
 * An abstract state for an NPC StateMachineAI. 
 */
export default abstract class NPCState extends State {

    // The parent NPC behavior
    protected parent: NPCGoapAI;

    constructor(parent: NPCGoapAI) {
        super(parent);
    }

    onEnter(options: Record<string, any>): void {}

    update(deltaT: number): void { }
    
    onExit(): Record<string, any> { return; }

    /**
     * Reducer function for the NPCState
     * @param event a game event
     */
    public handleInput(event: GameEvent): void {
        switch(event.type) {
            case BattlerEvent.BATTLER_CHANGE: {
                this.handleBattlerChange(event);
                break;
            }
            case ItemEvent.INVENTORY_CHANGED: {
                this.handleInventoryChange(event);
                break;
            }
            case BattlerEvent.HIT: {
                this.handleBattlerHit(event);
                break;
            }
            case ItemEvent.CONSUMABLE_USED: {
                this.handleConsumeItem(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event with type ${event.type} and data ${event.data} caught in NPCState`);
            }
        }
    }

    /**
     * Handles incoming changes to the NPCs Battler object
     * @param event a battler-change event
     */
    protected handleBattlerChange(event: GameEvent): void {
        // Send health changes to the UI
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {
            id: this.parent.owner.id,
            curhp: this.parent.battler.health,
            maxhp: this.parent.battler.maxHealth 
        });

        // If the NPCs health hit 0, tell the world the NPC is dead
        if (this.parent.battler.health <= 0) {
            this.emitter.fireEvent(NPCEvent.NPC_KILLED, {id: this.parent.owner.id});
        }
    }

    /**
     * Handle changes to the NPCs inventory
     * @param event an inventory-change event
     */
    protected handleInventoryChange(event: GameEvent): void {}

    /**
     * Handles incoming hit-events to the NPCs battler
     * @param event 
     */
    protected handleBattlerHit(event: GameEvent): void {
        let item: Item = event.data.get("item");
        switch(item.constructor) {
            // If the NPC was hit by a weapon - handle that somewhere else
            case Weapon: {
                this.handleWeaponHit(event);
                break;
            }
            default: {
                throw new Error(`Attempting to handle item hit event for an unsupported item of class ${item.constructor}`);
            }
        }
    }

    /** 
     * A reducer function for handling weapon-hit events 
     */
    protected handleWeaponHit(event: GameEvent): void {
        let type: WeaponType = event.data.get("type");

        // Switch on the type of the weapon
        switch(type.constructor) {
            case LaserGun: {
                // Handle the NPC being hit by a laser gun - should take damage
                if (event.data.get("userId") !== this.parent.owner.id) {
                    this.parent.battler.health -= type.damage;
                }
                break;
            }
            case Wand: {
                // If the NPC was hit by a Want (aka just a different color laser gun)
                if (event.data.get("userId") !== this.parent.owner.id) {
                    let battler: Battler = event.data.get("battler");
                    this.parent.battler.group = battler.group;
                    this.parent.goap.restart();
                }
                break;
            }
            default: {
                throw new Error(`Attempting to handle weapon hit from unsupported weapon type ${type}.`);
            }
        }
    }

    /**
     * A reducer function for handling item-consume events
     * @param event a consume-item event
     */
    protected handleConsumeItem(event: GameEvent): void {
        let type: ConsumableType = event.data.get("type");
        switch(type.constructor) {
            case HealthPack: {
                let effects = event.data.get("effects");
                let health: number = effects.health;
                this.parent.battler.health += health;
                break;
            }
            default: {
                throw new Error(`Attempting to handle consuming an unsupported consumable type ${type}`);
            }
        }
    }

}

import Active from "./Active";
import Dead from "./Dead";
export { Active, Dead }