import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import ConsumableType from "../../ItemSystem/ItemTypes/ConsumableType";
import WeaponType from "../../ItemSystem/ItemTypes/WeaponType";
import BattlerType from "../BattlerType";
import LaserGun from "../../ItemSystem/ItemTypes/LaserGun";
import Item from "../../ItemSystem/Items/Item";
import Weapon from "../../ItemSystem/Items/Weapon";

import { Debugger } from "../../../Debugger";
import { BattlerEvent } from "../../../Events";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import BattleManager from "../BattleManager";
import HealthPack from "../../ItemSystem/ItemTypes/HealthPack";

export default class Battler {

    protected _owner: GameNode;
    protected _manager: BattleManager;

    protected _maxHealth: number;
    protected _health: number;
    protected _speed: number;

    protected _dirty: boolean;
    protected emitter: Emitter;
    
    public constructor(owner: GameNode, battlerType: BattlerType) {
        this.owner = owner;
        this.emitter = new Emitter();

        this.maxHealth = battlerType.maxHealth;
        this.health = battlerType.health;
        this.speed = battlerType.speed;
    }

    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case BattlerEvent.HIT: {
                Debugger.print("battler", `Got a hit event in battler with owner id ${this.owner.id}`);
                this.handleHit(event);
                break;
            }
            case BattlerEvent.CONSUME: {
                Debugger.print("battler", `Got a consume event in battler with owner id ${this.owner.id}`);
                this.handleConsumeItem(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event in Battler with type ${event.type}`);
                break;
            }
        }
    }

    public clean(): void {
        Debugger.print("battler", `Cleaning battler with owner id: ${this.owner.id}. Owner `)
        this._dirty = false;
        if (this.owner.aiActive) {
            Debugger.print("battler", `Sending event with type BATTLER_CHANGED to this battlers AI`);
            this.owner._ai.handleEvent(new GameEvent(BattlerEvent.BATTLER_CHANGE));
        }
    }
    
    public get owner(): GameNode { return this._owner; }
    public get maxHealth(): number { return this._maxHealth; }
    public get health(): number { return this._health; }
    public get speed(): number { return this._speed; }
    public get dirty(): boolean { return this._dirty; }

    protected set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth;
        this.dirty = true;
    }
    protected set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth); 
        this.dirty = true;
    }
    protected set speed(speed: number) {
        this._speed = speed;
        this.dirty = true;
    }
    protected set owner(owner: GameNode) { 
        this._owner = owner; 
    }
    protected set dirty(dirty: boolean) { 
        this._dirty = dirty; 
    }

    protected handleHit(event: GameEvent): void {
        let item: Item = event.data.get("item");
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
            case HealthPack: {
                Debugger.print("battler", "Handling consuming a healthpack!");
                let effects = event.data.get("effects");
                let health: number = effects.health;
                this.health += health;
                break;
            }
            default: {
                throw new Error(`Attempting to handle consuming an unsupported consumable type ${type}`);
            }
        }
    }

}