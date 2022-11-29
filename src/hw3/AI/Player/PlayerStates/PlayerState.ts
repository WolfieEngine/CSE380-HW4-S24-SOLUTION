import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Items/Item";
import PlayerAI from "../PlayerAI";


export enum PlayerAnimationType {
    IDLE = "IDLE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD"
}

export default abstract class PlayerState extends State {

    protected parent: PlayerAI;

    public constructor(parent: PlayerAI) {
        super(parent);
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {
        // Adjust the angle the player is facing 
        this.parent.owner.rotation = this.parent.controller.rotation;
        // Move the player
        this.parent.owner.move(this.parent.controller.moveDir);

        if (this.parent.controller.pickingUp) this.emitter.fireEvent("pickup", {id: this.parent.owner.id});
        if (this.parent.controller.dropping) this.emitter.fireEvent("drop", {id: this.parent.owner.id});
        if (this.parent.controller.useItem) this.parent.useItem();
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            case BattlerEvent.BATTLER_CHANGE: {
                this.handleBattlerChange(event);
                break;
            }
            case ItemEvent.INVENTORY_CHANGED: {
                this.handleInventoryChange(event);
                break;
            }
            case ItemEvent.CONSUMABLE_USED: {
                this.handleConsumeItem(event);
                break;
            }
            case BattlerEvent.HIT: {
                this.handleBattlerHit(event);
                break;  
            }
            default: {
                throw new Error(`Unhandled event with type ${event.type} and data ${event.data} caught in PlayerState`);
            }
        }
    }

    protected handleBattlerChange(event: GameEvent): void {
        let id: number = this.parent.battler.owner.id;
        let curhp: number = this.parent.battler.health;
        let maxhp: number = this.parent.battler.maxHealth;

        // Update the players healthbar in the UI
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: id, curhp: curhp, maxhp: maxhp});

        // If the players battler has no health, the player is dead.
        if (this.parent.battler.health <= 0) {
            this.finished(PlayerStateType.DEAD);
        }
    }
    protected handleInventoryChange(event: GameEvent): void {
        let items: Item[] = event.data.get("inv");

        // If the player doesn't have their held item in their inventory, clear the players held item
        if (this.parent.item !== null && items.find((item: Item) => this.parent.item.owner.id === item.owner.id) === undefined) {
            this.parent.item = null;
        }
        // If the player has items in their inventory, set the first item to be their held item
        if (items.length !== 0) { 
            this.parent.item = items.find((item: Item) => item)
        }
        // Update the inventory hud
        this.emitter.fireEvent("inv", {items: items});
    }
    protected handleBattlerHit(event: GameEvent): void {
        let item: Item = event.data.get("item");
        switch(item.constructor) {
            case Weapon: {
                this.handleWeaponHit(event);
                break;
            }
            default: {
                throw new Error(`Attempting to handle item hit event for an unsupported item of class ${item.constructor}`);
            }
        }
    }
    protected handleWeaponHit(event: GameEvent): void {
        let type: WeaponType = event.data.get("type");
        switch(type.constructor) {
            case LaserGun: {
                if (event.data.get("userId") !== this.parent.owner.id) {
                    this.parent.battler.health -= type.damage;
                }
                break;
            }
            case Wand: {
                break;
            }
            default: {
                throw new Error(`Attempting to handle weapon hit from unsupported weapon type ${type}.`);
            }
        }
    }
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

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Dead from "./Dead";
import Weapon from "../../../GameSystems/ItemSystem/Items/Weapon";
import ConsumableType from "../../../GameSystems/ItemSystem/ItemTypes/ConsumableType";
import HealthPack from "../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import LaserGun from "../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import WeaponType from "../../../GameSystems/ItemSystem/ItemTypes/WeaponType";
import Wand from "../../../GameSystems/ItemSystem/ItemTypes/Wand";
export { Idle, Invincible, Moving, Dead} 