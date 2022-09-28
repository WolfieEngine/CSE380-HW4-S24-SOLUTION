import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent } from "../../Events"
import Item from "../../GameSystems/ItemSystem/Items/Item";
import PlayerAI from "../PlayerAI";


export enum PlayerAnimationType {
    IDLE = "IDLE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
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
                this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {
                    id: this.parent.battler.owner.id, 
                    curhp: this.parent.battler.health, 
                    maxhp: this.parent.battler.maxHealth
                });
                break;
            }
            case ItemEvent.INVENTORY_CHANGED: {
                this.handleInventoryChange(event);
                break;
            }
            case BattlerEvent.CONSUME: {
                this.parent.battler.handleEvent(event);
                break;
            }
            case BattlerEvent.HIT: {
                this.parent.battler.handleEvent(event);
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
        let maxhp: number = 1;
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: id, curhp: curhp, maxhp: maxhp});
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

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
export { Idle, Invincible, Moving } 