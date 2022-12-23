import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Spritesheet from "../../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite"
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import HW3Scene from "../../Scenes/HW3Scene";

export default class NPCActor extends AnimatedSprite {

    /** Override the type of the scene to be the HW3 scene */
    protected scene: HW3Scene

    // Add our NPC stats 
    protected _maxHealth: number;
    protected _health: number;
    protected _battleGroup: number;
    protected _speed: number;
    // Add our NPCs inventory
    protected _inventory: Inventory;

    constructor(sheet: Spritesheet) {
        super(sheet);
    }

    setScene(scene: HW3Scene): void { this.scene = scene; }
    getScene(): HW3Scene { return this.scene; }


    /** Inventory Interface */
    public get inventory(): Inventory { return this._inventory; }

    /** Checks if the NPC can see a target */
    public isTargetVisible(pos: Vec2): boolean { 

        // Get the new player location
        let start = this.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = this.scene.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;
    }
}