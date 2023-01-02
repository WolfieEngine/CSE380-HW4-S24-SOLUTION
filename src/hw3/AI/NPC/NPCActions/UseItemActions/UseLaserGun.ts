import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Item from "../../../../GameSystems/ItemSystem/Item";
import LaserGun from "../../../../GameSystems/ItemSystem/Items/LaserGun";
import NPCActor from "../../NPCActor";
import NPCAction from "../NPCAction";

export default abstract class UseLaserGun extends NPCAction {

    protected item: LaserGun | null;

    public constructor(key: string) {
        super(key);
        this.item = null;
    }

    public performAction(actor: NPCActor): GoapActionStatus {
        if (this.item === null) { return GoapActionStatus.FAILURE; }

        // Set the start, direction, and end position to shoot the laser gun
        this.item.laserStart.copy(actor.position);
        this.item.direction.copy(actor.position.dirTo(this.target));
        this.item.laserEnd.copy(this.getLaserEnd(actor, this.item.laserStart, this.item.laserEnd));

        // Play the shooting animation for the laser gun
        this.item.playShootAnimation();
        return GoapActionStatus.SUCCESS;
    }

    /**
     * Sets this.item to a laser gun in the 
     * @param actor the NPC
     */
    public planAction(actor: NPCActor): void {
        let item = actor.inventory.find(item => item.constructor === LaserGun);
        if (item !== null && item.constructor === LaserGun) {
            this.item = item;
        } else {
            this.item = null;
        }
    }

    protected getLaserEnd(actor: NPCActor, start: Vec2, dir: Vec2): Vec2 {
        let end = start.clone().add(dir.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        // Get the wall tilemap
        let walls = actor.getScene().getWalls();

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