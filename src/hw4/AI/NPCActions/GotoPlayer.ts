import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import BattleManager from "../../GameSystems/BattleSystem/BattleManager";
import Battler from "../../GameSystems/BattleSystem/Battlers/Battler";
import PlayerBattler from "../../GameSystems/BattleSystem/Battlers/PlayerBattler";
import { GoapActionStatus } from "../Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class GotoPlayer extends NPCAction<GotoPlayerOptions> {

    protected player: GameNode;
    protected position: Vec2;
    protected path: NavigationPath;

    constructor(init: GotoPlayerOptions, cost?: number, preconditions?: string[], effects?: string[]) { 
        super(cost, preconditions, effects);
        this.player = init.player;
    }

    init(init: GotoPlayerOptions): void {
        this.player = init.player;
        this.position = Vec2.ZERO;
    }

    start(npc: NPCGoapAI): void {
        // this.position.copy(this.player.position);
        this.path = npc.getPath(this.player.position);
        console.log("Starting GotoPlayer action");
    }

    run(npc: NPCGoapAI): GoapActionStatus {
        console.log("Running GotoPlayer action!");
        if (this.path.isDone()) {
            return GoapActionStatus.SUCCESS;
        }
        
        npc.moveOnPath(npc.speed, this.path);
        return GoapActionStatus.RUNNING;
    }

    stop(npc: NPCGoapAI): void {}

    checkProceduralPreconditions(npc: NPCGoapAI): boolean {
        //Check if one player is visible, taking into account walls
        let pos: Vec2 = this.player.position;

        // Get the new player location
        let start = npc.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.player.getScene().getLayer("Wall").getItems()[0];

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

interface GotoPlayerOptions {
    player: GameNode
}