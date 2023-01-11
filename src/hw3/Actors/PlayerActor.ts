import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { ItemEvent } from "../Events";
import BasicBattler from "../GameSystems/BattleSystem/BasicBattler";
import Battler from "../GameSystems/BattleSystem/Battler";
import HW3Battler from "../GameSystems/BattleSystem/HW3Battler";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import HW3Item from "../GameSystems/ItemSystem/Item";
import { TargetingEntity } from "../GameSystems/Targeting/TargetingEntity";
import HW3Scene from "../Scenes/HW3Scene";


export default class PlayerActor extends AnimatedSprite implements HW3Battler {

    /** Override the type of the scene to be the HW3 scene */
    protected scene: HW3Scene

    /** Give the player a battler compoonent */
    protected battler: Battler;
    protected _heldItem: HW3Item;

    constructor(sheet: Spritesheet) {
        super(sheet);
        this.battler = new BasicBattler();
    }
    get battlerActive(): boolean {
        throw new Error("Method not implemented.");
    }
    set battlerActive(value: boolean) {
        throw new Error("Method not implemented.");
    }
    
    getTargeting(): TargetingEntity[] {
        throw new Error("Method not implemented.");
    }
    addTargeting(targeting: TargetingEntity): void {
        throw new Error("Method not implemented.");
    }
    removeTargeting(targeting: TargetingEntity): void {
        throw new Error("Method not implemented.");
    }

    public setScene(scene: HW3Scene): void { this.scene = scene; }
    public getScene(): HW3Scene { return this.scene; }

    get battleGroup(): number {
        return this.battler.battleGroup;
    }
    set battleGroup(value: number) {
        this.battler.battleGroup = value;
    }
    get maxHealth(): number {
        return this.battler.maxHealth;
    }
    set maxHealth(value: number) {
        this.battler.maxHealth = value;
    }
    get health(): number {
        return this.battler.health;
    }
    set health(value: number) {
        this.battler.health = value;
    }
    get speed(): number {
        return this.battler.speed;
    }
    set speed(value: number) {
        this.battler.speed = value;
    }
    get inventory(): Inventory {
        return this.battler.inventory;
    }
}