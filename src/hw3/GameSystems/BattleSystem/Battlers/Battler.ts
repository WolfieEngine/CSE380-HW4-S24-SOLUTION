import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import ConsumableType from "../../ItemSystem/ItemTypes/ConsumableType";
import WeaponType from "../../ItemSystem/ItemTypes/WeaponType";
import BattlerType from "../BattlerType";
import LaserGun from "../../ItemSystem/ItemTypes/LaserGun";
import Item from "../../ItemSystem/Items/Item";
import Weapon from "../../ItemSystem/Items/Weapon";

import { BattlerEvent } from "../../../Events";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import HealthPack from "../../ItemSystem/ItemTypes/HealthPack";

export default class Battler {

    protected _owner: GameNode;

    protected _maxHealth: number;
    protected _health: number;
    protected _group: number;
    protected _speed: number;

    protected _dirty: boolean;
    protected emitter: Emitter;
    
    public constructor(owner: GameNode, type: BattlerType) {
        this.owner = owner;
        this.emitter = new Emitter();
        this.maxHealth = type.maxHealth;
        this.health = type.health;
        this.speed = type.speed;
        this.group = type.group
    }

    public clean(): void {
        this._dirty = false;
        if (this.owner.aiActive) {
            this.owner._ai.handleEvent(new GameEvent(BattlerEvent.BATTLER_CHANGE));
        }
    }
    
    public get owner(): GameNode { return this._owner; }
    public get maxHealth(): number { return this._maxHealth; }
    public get health(): number { return this._health; }
    public get speed(): number { return this._speed; }
    public get group(): number { return this._group; }
    public get dirty(): boolean { return this._dirty; }

    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth;
        this.dirty = true;
    }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth); 
        this.dirty = true;
    }
    public set speed(speed: number) {
        this._speed = speed;
        this.dirty = true;
    }
    public set group(group: number) {
        this._group = group;
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
                if (event.data.get("userId") !== this.owner.id) {
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