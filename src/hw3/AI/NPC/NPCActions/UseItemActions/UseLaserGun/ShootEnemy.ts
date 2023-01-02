import { GoapActionStatus } from "../../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../../Wolfie2D/Nodes/GameNode";
import HW3Scene from "../../../../../Scenes/HW3Scene";
import Battler from "../../../../Battler";
import NPCActor from "../../../NPCActor";
import UseLaserGun from "../UseLaserGun";

export default class ShootEnemy extends UseLaserGun {

    protected actor: NPCActor | null;
    protected scene: HW3Scene | null;
    protected enemy: Battler | null;

    public static readonly RANGE: number = 50;

    public constructor(key: string) {
        super(key);
        this._range = ShootEnemy.RANGE;

        this.actor = null;
        this.scene = null;
        this.enemy = null;
    }

    public override performAction(actor: NPCActor): GoapActionStatus {
        let res = super.performAction(actor);
        // If the action was successful, figure out which of the other battlers were hit
        if (res === GoapActionStatus.SUCCESS) {
            let hits = this.getLaserHits(actor, this.item.laserStart, this.item.laserEnd);
        }
        return res;
    }
    
    public override planAction(actor: NPCActor): void {
        super.planAction(actor);

        // Hold a reference to the actor who's going to perform this action
        this.actor = actor;
        // Hold a reference to the scene the actor is performing the action in
        this.scene = actor.getScene()

        // Gets the closest, visible enemy to the actor 
        this.enemy = this.scene.getBattlers().filter((battler) => {
            battler.battleGroup !== actor.battleGroup && this.scene.isTargetVisible(this.actor.position, battler.position)
        }).reduce((b1, b2) => {
            return b1.position.distanceSqTo(this.actor.position) < b2.position.distanceSqTo(this.actor.position) ? b1 : b2;
        });

        // Copy the enemies current known coordinates into the target vector
        this.target.copy(this.enemy.position);
    }

    public override get target(): Vec2 {
        // If anything is null or the enemy is not visible - return the enemies last known position
        if (this.scene === null || this.enemy === null || this.actor === null || !this.scene.isTargetVisible(this.actor.position, this.enemy.position)) {
            return super.target;
        }
        // Otherwise (if the enemy is visible) set the target position to the enemy's position and return the updated target.
        return this.target.copy(this.enemy.position);

    }


    protected getLaserHits(actor: NPCActor, start: Vec2, end: Vec2): Battler[] {
        return actor.getScene().getBattlers().filter((b) => {
            return b.collisionShape !== undefined && b.collisionShape.getBoundingRect().intersectSegment(start, end.clone().sub(start)) !== null
        });
    }
}