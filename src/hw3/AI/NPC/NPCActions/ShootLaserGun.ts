import { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";

export default class ShootLaserGun extends NPCAction {

    protected lasergun: LaserGun | null;
    protected target: TargetableEntity | null;
    
    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.lasergun = null;
        this.target = null;
    }

    public onEnter(options: Record<string, any>): void {
        // If the actor doesn't have a target -> finish the action
        if (this.actor.hasTarget()) {
            // Otherwise get the targeted entity 
            this.target = this.actor.getTarget();
        }

        // Find a lasergun in the actors inventory
        let lasergun = this.actor.inventory.find(item => item.constructor === LaserGun);
        if (lasergun !== null && lasergun.constructor === LaserGun) {
            this.lasergun = lasergun;
        }
    }

    public handleInput(event: GameEvent): void {
        
    }

    public update(deltaT: number): void {
        // If the lasergun is not null, the target isn't null, and the lasergun is in the actors inventory; shoot the lasergun
        if (this.lasergun !== null && this.target !== null && this.lasergun.inventory !== null && this.lasergun.inventory.id === this.actor.inventory.id) {
            // Set the start, direction, and end position to shoot the laser gun
            this.lasergun.laserStart.copy(this.actor.position);
            this.lasergun.direction.copy(this.actor.position.dirTo(this.target.position));
            this.lasergun.laserEnd.copy(this.getLaserEnd(this.actor.getScene().getWalls(), this.lasergun.laserStart, this.lasergun.laserEnd));

            // Play the shooting animation for the laser gun
            this.lasergun.playShootAnimation();

            // Send a laser fired event
            this.emitter.fireEvent("laser-fired", {
                aid: this.actor.id,
                lid: this.lasergun.id, 
                to: this.lasergun.laserStart.clone(), 
                from: this.lasergun.laserEnd.clone()
            });
        }
        // Finish the action
        this.finished();
    }

    public onExit(): Record<string, any> {
        // Clear the references to the target and the lasergun
        this.target = null;
        this.lasergun = null;
        return {}
    }

    protected getLaserEnd(walls: OrthogonalTilemap, start: Vec2, dir: Vec2): Vec2 {
        let end = start.clone().add(dir.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        let minIndex = walls.getTilemapPosition(minX, minY);
		let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                        end = hit.pos;
                    }
                }
            }
        }
        return end;
    }

}