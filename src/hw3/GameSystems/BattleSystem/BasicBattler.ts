import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Inventory from "../ItemSystem/Inventory";
import Battler from "./Battler";

export default class BasicBattler implements Battler {

    protected _position: Vec2;
    protected _maxHealth: number;
    protected _health: number;
    protected _battleGroup: number;
    protected _speed: number;
    protected _active: boolean;
    protected _inventory: Inventory;

    public constructor() {
        this.position = Vec2.ZERO;
        this.maxHealth = 0;
        this.health = 0;
        this.battleGroup = 0;
        this.speed = 0;
        this.inventory = new Inventory();
        this.battlerActive = true;
    }

    public get position(): Vec2 { return this._position; }
    public set position(position: Vec2) { this._position = position; }

    get relativePosition(): Vec2 {
        throw new Error("Method not supported. This method should be removed from the positioned interface. A relative position only makes sense in the context of the viewport.");
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
    
}