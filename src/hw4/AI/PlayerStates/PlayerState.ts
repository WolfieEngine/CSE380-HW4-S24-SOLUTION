import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { ItemEvent } from "../../Events/ItemEvent";
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
            case "": {
                this.parent.battler.handleEvent(event);
                break;
            }
            case "BATTLER_CHANGED": {
                this.emitter.fireEvent("btt", {battler: this.parent.battler});
                break;
            }
            case ItemEvent.INVENTORY_CHANGED: {
                this.handleInventoryChange(event);
                break;
            }
            case "WEAPON_HIT": {
                // Delgate weapon hit event handling to the PlayerBattler
                this.parent.battler.handleEvent(event);
                break;  
            }
            default: {
                throw new Error(`Unhandled event with type ${event.type} and data ${event.data} caught in PlayerState`);
            }
        }
    }

    protected handleInventoryChange(event: GameEvent): void {
        let items: Item[] = event.data.get("inv");
        // If the player doesn't have a held item and has an item in their inventory, give them an item
        if (this.parent.item === null && items.length !== 0) {
            this.parent.item = items.find((item: Item) => item);
        }
        // If the player doesn't have their held item in their inventory, clear the players held item
        if (items.find((item: Item) => this.parent.item.owner.id === item.owner.id) === undefined) {
            this.parent.item = null;
        }
        // Update the inventory hud
        this.emitter.fireEvent("inv", {items: items});
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
export { Idle, Invincible, Moving } 