import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { Debugger } from "../../../Debugger";
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

export enum NPCStateType {
    ACTIVE = "ACTIVE",
    DEAD = "DEAD"
}

export default abstract class NPCState extends State {

    protected parent: NPCGoapAI;

    constructor(parent: NPCGoapAI) {
        super(parent);
    }

    onEnter(options: Record<string, any>): void {}

    update(deltaT: number): void { this.parent.goap.update(deltaT); }
    
    onExit(): Record<string, any> { return; }

    handleInput(event: GameEvent): void {
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

    protected handleBattlerChange(event: GameEvent): void {
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {
            id: this.parent.owner.id,
            curhp: this.parent.battler.health,
            maxhp: this.parent.battler.maxHealth 
        });

        if (this.parent.battler.health <= 0) {
            this.emitter.fireEvent(NPCEvent.NPC_KILLED, {id: this.parent.owner.id});
        }
    }

    protected handleInventoryChange(event: GameEvent): void {

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
                if (event.data.get("userId") !== this.parent.owner.id) {
                    let battler: Battler = event.data.get("battler");
                    console.log("User group: " + battler.group);
                    console.log("NPC group: " + this.parent.battler.group);
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
    protected handleConsumeItem(event: GameEvent): void {
        let type: ConsumableType = event.data.get("type");
        switch(type.constructor) {
            case HealthPack: {
                Debugger.print("battler", "Handling consuming a healthpack!");
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