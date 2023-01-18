import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Inventory from "../ItemSystem/Inventory";
import { TargetableEntity } from "../Targeting/TargetableEntity";
import { TargetingEntity } from "../Targeting/TargetingEntity";
import Battler from "./Battler";

export default class BasicBattler implements Battler {

    protected owner: TargetableEntity;
    protected _inventory: Inventory;

    protected _maxHealth: number;
    protected _health: number;
    protected _battleGroup: number;
    protected _speed: number;
    protected _active: boolean;

    public constructor(targetable: TargetableEntity) {
        this.owner = targetable;
        this.inventory = new Inventory();

        this.maxHealth = 0;
        this.health = 0;
        this.battleGroup = 0;
        this.speed = 0;
        this.battlerActive = true;
    }
    
    public get id(): number { return this.owner.id; }

    public get position(): Vec2 { return this.owner.position; }
    public set position(position: Vec2) { this.owner.position = position; }

    public get relativePosition(): Vec2 {
        return this.owner.relativePosition;
    }

    public get battleGroup(): number { return this._battleGroup; }
    public set battleGroup(battleGroup: number) { this._battleGroup = battleGroup; }

    public get maxHealth(): number { return this._maxHealth }
    public set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    public get health(): number { return this._health; }
    public set health(health: number) { this._health = health; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get inventory(): Inventory { return this._inventory; }
    protected set inventory(inventory: Inventory) { this._inventory = inventory; }

    public get battlerActive(): boolean { return this._active; }
    public set battlerActive(value: boolean) { this._active = value; }
    
    public getTargeting(): TargetingEntity[] { return this.owner.getTargeting(); }
    public addTargeting(targeting: TargetingEntity): void { this.owner.addTargeting(targeting); }
    public removeTargeting(targeting: TargetingEntity): void { this.owner.removeTargeting(targeting); }
}