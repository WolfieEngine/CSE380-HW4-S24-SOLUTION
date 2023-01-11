import Spritesheet from "../../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite"
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import { HudEvent } from "../../Events";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import HW3Scene from "../../Scenes/HW3Scene";
import BasicTargetable from "../../GameSystems/Targeting/BasicTargetable";
import BasicTargeting from "../../GameSystems/Targeting/BasicTargeting";

import Battler from "../../GameSystems/BattleSystem/Battler";
import { TargetableEntity } from "../../GameSystems/Targeting/TargetableEntity";
import { TargetingEntity } from "../../GameSystems/Targeting/TargetingEntity";
import BasicBattler from "../../GameSystems/BattleSystem/BasicBattler";
import HW3Battler from "../../GameSystems/BattleSystem/HW3Battler";


export default class NPCActor extends AnimatedSprite implements HW3Battler, TargetingEntity {

    /** Override the type of the scene to be the HW3 scene */
    protected scene: HW3Scene

    // The key of the Navmesh to use to build paths for this NPCActor
    protected _navkey: string;

    // The NPCs battler object
    protected _battler: Battler;

    // The entity the NPC is currently targeting
    protected _targetable: TargetableEntity;
    protected _targeting: TargetingEntity

    public constructor(sheet: Spritesheet) {
        super(sheet);
        this._navkey = "navkey";
        this._battler = new BasicBattler();
        this._targetable = new BasicTargetable(this.position);
        this._targeting = new BasicTargeting();

        this.receiver.subscribe("use-hpack");
    }

    clearTarget(): void { this._targeting.clearTarget(); }

    setTarget(targetable: TargetableEntity): void {
        this._targeting.setTarget(targetable);
    }

    hasTarget(): boolean {
        return this._targeting.hasTarget();
    }

    getTarget(): TargetableEntity {
        return this._targeting.getTarget();
    }
    
    getTargeting(): TargetingEntity[] { 
        return this._targetable.getTargeting(); 
    }

    addTargeting(targeting: TargetingEntity): void { 
        this._targetable.addTargeting(targeting); 
    }

    removeTargeting(targeting: TargetingEntity): void {
        this._targetable.removeTargeting(targeting);
    }

    atTarget(): boolean {
        return this._targeting.getTarget().position.distanceSqTo(this.position) < 625;
    }

    public get battlerActive(): boolean { return this.battler.battlerActive; }
    public set battlerActive(value: boolean) { this.battler.battlerActive = value; }

    public get battleGroup(): number { return this.battler.battleGroup; }
    public set battleGroup(battleGroup: number) { this.battler.battleGroup = battleGroup; }

    public get maxHealth(): number { return this.battler.maxHealth }
    public set maxHealth(maxHealth: number) { 
        this.battler.maxHealth = maxHealth; 
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: this.id, curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this.battler.health; }
    public set health(health: number) { 
        this.battler.health = health; 
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: this.id, curhp: this.health, maxhp: this.maxHealth});
    }

    public get speed(): number { return this.battler.speed; }
    public set speed(speed: number) { this.battler.speed = speed; }

    public override setScene(scene: HW3Scene): void { this.scene = scene; }
    public override getScene(): HW3Scene { return this.scene; }

    public get navkey(): string { return this._navkey; }
    public set navkey(navkey: string) { this._navkey = navkey; }

    getPath(to: Vec2, from: Vec2): NavigationPath { 
        return this.scene.getNavigationManager().getPath(this.navkey, to, from);
    }

    public get inventory(): Inventory { return this.battler.inventory; }

    protected get battler(): Battler { return this._battler; }
    protected get targetable(): TargetableEntity { return this._targetable; }
    protected get targeting(): TargetingEntity { return this._targeting; }
}