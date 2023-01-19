import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../Actors/NPCActor";
import AstarStrategy from "../../Pathfinding/AstarStrategy";

export default class AStarDemoScene extends Scene {

    protected npc: NPCActor;
    protected destination: Vec2;

    protected path: NavigationPath;

    public loadScene(): void {
        this.load.tilemap("level", "hw4_assets/tilemaps/HW3Tilemap.json");
        this.load.spritesheet("BlueEnemy", "hw4_assets/spritesheets/BlueEnemy.json");
    }

    public startScene(): void {
        let tilemapLayers = this.add.tilemap("level");
        let walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        this.viewport.setBounds(0, 0, walls.size.x, walls.size.y);
        this.viewport.setZoomLevel(2);

        this.addLayer("primary", 10);

        let navmesh = this.initializeNavmesh(new PositionGraph(), walls);
        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);

        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        // Select A* as our navigation strategy
        navmesh.setStrategy("astar");

        this.npc = this.add.animatedSprite(NPCActor, "BlueEnemy", "primary")
        this.npc.addPhysics();
        this.npc.position.copy(new Vec2(25, 450));
        this.destination = new Vec2(450, 25);

        let destination = this.add.graphic(GraphicType.RECT, "primary", {position: this.destination, size: new Vec2(20, 20)})
        destination.color = Color.BLUE;
        destination.color.a = .50;

        this.path = navmesh.getNavigationPath(this.npc.position, this.destination);
    }

    public updateScene(deltaT: number): void {
        // Move along the path
        this.npc.moveOnPath(1, this.path);
    }
    
    /**
     * Initializes the navmesh graph used by the NPCs in the HW3Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * @author PeteyLumpkins
     */
    protected initializeNavmesh(graph: PositionGraph, walls: OrthogonalTilemap): Navmesh {

        let dim: Vec2 = walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = walls.getTileCollider(j, i);
                graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < graph.numVertices; i++) {
            rc = walls.getTileColRow(i);
            if (!walls.isTileCollidable(rc.x, rc.y) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !walls.isTileCollidable(rc.x, rc.y)) {
                    graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = walls.getTileColRow(i + dim.x);
                if (i + dim.x < graph.numVertices && !walls.isTileCollidable(rc.x, rc.y)) {
                    graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        return new Navmesh(graph);

    }
}