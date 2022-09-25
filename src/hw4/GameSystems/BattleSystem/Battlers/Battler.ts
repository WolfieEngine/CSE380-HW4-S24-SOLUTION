import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import ConsumableType from "../../ItemSystem/ItemTypes/ConsumableType";
import WeaponType from "../../ItemSystem/ItemTypes/WeaponType";
import BattlerType from "../BattlerType";
import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import LaserGun from "../../ItemSystem/ItemTypes/LaserGun";
import Item from "../../ItemSystem/Items/Item";
import Weapon from "../../ItemSystem/Items/Weapon";

import { Debugger } from "../../../Debugger";

export default class Battler {

    protected _owner: GameNode;

    protected _health: number;
    protected _speed: number;

    protected _dirty: boolean;
    protected emitter: Emitter;
    
    public constructor(owner: GameNode, battlerType: BattlerType) {
        this.owner = owner;
        this.emitter = new Emitter();
    }

    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case "WEAPON_HIT": {
                Debugger.print("battler", `Got a weapon hit event in battler with owner id ${this.owner.id}`)
                this.handleWeaponHit(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event in Battler with type ${event.type}`);
            }
        }
    }

    public clean(): void {
        Debugger.print("battler", `Cleaning battler with owner id: ${this.owner.id}. Owner `)
        this._dirty = false;
        if (this.owner.aiActive) {
            Debugger.print("battler", `Sending event with type BATTLER_CHANGED to this battlers AI`);
            this.owner._ai.handleEvent(new GameEvent("BATTLER_CHANGED"));
        }
    }
    
    public get owner(): GameNode { return this._owner; }
    public get health(): number { return this._health; }
    public get speed(): number { return this._speed; }
    public get dirty(): boolean { return this._dirty; }

    protected set health(health: number) { 
        this._health = health; 
        this._dirty = true;
    }
    protected set speed(speed: number) {
        this._speed = speed;
        this._dirty = true;
    }
    protected set owner(owner: GameNode) { 
        this._owner = owner; 
    }
    protected set dirty(dirty: boolean) { 
        this._dirty = dirty; 
    }

    protected handleHit(event: GameEvent): void {
        let item: Item = event.data.get("class");
        switch(item.constructor) {
            case Weapon: {
                Debugger.print("battler", "Handling a weapon hit!");
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
                Debugger.print("battler", "Handling a laser gun hit!");
                if (event.data.get("userId") !== this.owner.id) {
                    Debugger.print("battler", "Battler taking damage from a laser gun!");
                    console.log("Taking damage from a laser gun")
                    this.health -= type.damage;
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
            default: {
                break;
            }
        }
    }

}