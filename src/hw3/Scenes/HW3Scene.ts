import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import HealthbarManager from "../UI/HealthbarManager";

import HealerBehavior from "../AI/NPC/NPCBehavior/HealerBehavior";
import IdleBehavior from "../AI/NPC/NPCBehavior/IdleBehavior";

import InventoryHUD from "../UI/InventoryHUD";
import PlayerAI from "../AI/Player/PlayerAI";

// import HW3WorldState from "../GameSystems/WorldState";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";

// import NPCGoapFactory, { NPCGoapType } from "../AI/NPC/NPCGoapFactory";

import { NPCEvent, PlayerEvent } from "../Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameOver from "./GameOver";

import AstarStrategy from "../Pathfinding/AstarStrategy";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import PlayerActor from "../Actors/PlayerActor";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../Actors/NPCActor";
import GruntBehavior from "../AI/NPC/NPCBehavior/GaurdBehavior";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import NPCBehavior from "../AI/NPC/NPCBehavior";
import HW3Battler from "../GameSystems/BattleSystem/HW3Battler";
import GuardBehavior from "../AI/NPC/NPCBehavior/GaurdBehavior";


export default class HW3Scene extends Scene {

    /** GameSystems in the HW3 Scene */
    private healthbarManager: HealthbarManager;
    private inventoryHud: InventoryHUD;

    /** GameNodes in the HW3 Scene */
    private player: PlayerActor;

    private battlers: HW3Battler[];

    private healthpacks: Array<Healthpack>;
    private laserguns: Array<LaserGun>;

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<HW3Battler>();
        this.laserguns = new Array<LaserGun>();
        this.healthpacks = new Array<Healthpack>();
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/player1.json");

        // Load in the enemy sprites
        this.load.spritesheet("BlueEnemy", "hw4_assets/spritesheets/BlueEnemy.json");
        this.load.spritesheet("RedEnemy", "hw4_assets/spritesheets/RedEnemy.json");
        this.load.spritesheet("BlueHealer", "hw4_assets/spritesheets/BlueHealer.json");
        this.load.spritesheet("RedHealer", "hw4_assets/spritesheets/RedHealer.json");

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/HW3Tilemap.json");

        // Load the enemy locations
        this.load.object("red", "hw4_assets/data/enemies/red.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");

        // Load the healthpack and lasergun loactions
        this.load.object("healthpacks", "hw4_assets/data/items/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/items/laserguns.json");

        // Load the healthpack, inventory slot, and laser gun sprites
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(2);

        this.initLayers();
        this.initializeSystems();
        // Create the player
        this.initializePlayer();
        this.initializeItems();

        this.viewport.follow(this.player);

        this.initializeNavmesh();

        // Create the NPCS
        this.initializeNPCs();

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");

        // Add a UI for health
        this.addUILayer("health");


        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(NPCEvent.NPC_KILLED);
    }
    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.healthbarManager.update(deltaT);
        this.inventoryHud.update(deltaT);
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case PlayerEvent.PLAYER_KILLED: {
                this.handlePlayerKilled(event);
                break;
            }
            case NPCEvent.NPC_KILLED: {
                this.handleNPCKilled(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in HW3Scene event handler`);
            }
        }
    }

    /**
     * Handles a player-killed event
     * @param event a player-killed event
     */
    protected handlePlayerKilled(event: GameEvent): void {
        this.emitter.fireEvent(GameEventType.CHANGE_SCENE, { scene: GameOver, init: {} });
    }
    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleNPCKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        this.healthbarManager.unregister(id).destroy();
        this.sceneGraph.getNode(id).destroy();
    }

    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("slots");
        this.addUILayer("items");
        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }

    /**
     * Initialize the scenes main subsystems
     */
    protected initializeSystems(): void {
        this.healthbarManager = new HealthbarManager(this, "primary");
        this.inventoryHud = new InventoryHUD(this, 9, 8, new Vec2(232, 24), "items", "inventorySlot", "slots")
    }

    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        this.player = this.add.animatedSprite(PlayerActor, "player1", "primary");
        this.player.position.set(40, 40);

        this.player.battleGroup = 2;

        // Give the player physics
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
        // Give the player a healthbar
        this.healthbarManager.register(this.player, this.player.size.clone());
        // Give the player PlayerAI
        this.player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        this.player.animation.play("IDLE");

        this.battlers.push(this.player);
    }
    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {

        // Get the object data for the red enemies
        let red = this.load.getObject("red");

        // Initialize the red healers
        for (let i = 0; i < 0; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedHealer", "primary");
            npc.position.set(red.healers[i][0], red.healers[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            npc.battleGroup = 1;
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            this.healthbarManager.register(npc, npc.size.clone());

            npc.addAI(HealerBehavior);
            npc.animation.play("IDLE");
            this.battlers.push(npc);
        }

        for (let i = 0; i < 1; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedEnemy", "primary");
            npc.position.set(red.enemies[i][0], red.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            this.healthbarManager.register(npc, npc.size.clone());
            
            // Set the NPCs stats
            npc.battleGroup = 1
            npc.speed = 10;
            npc.health = 1;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            // Give the NPCs their AI
            npc.addAI(GuardBehavior, {target: npc, range: 25});

            // Play the NPCs "IDLE" animation 
            npc.animation.play("IDLE");
            // Add the NPC to the battlers array
            this.battlers.push(npc);
        }

        // Get the object data for the blue enemies
        let blue = this.load.getObject("blue");

        // Initialize the blue enemies
        // for (let i = 0; i < blue.enemies.length; i++) {
        //     let npc = this.add.animatedSprite(NPCActor, "BlueEnemy", "primary");
        //     npc.position.set(blue.enemies[i][0], blue.enemies[i][1]);
        //     npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

        //     // Give the NPCS their healthbars
        //     this.healthbarManager.register(npc, npc.size.clone());

        //     // Give the NPCs their AI
        //     npc.addAI(GruntBehavior);

        //     // Play the NPCs "IDLE" animation 
        //     npc.animation.play("IDLE");

        //     this.battlers.push(npc);
        // }

        // Initialize the blue healers
        // for (let i = 0; i < blue.healers.length; i++) {
        //     let npc = this.add.animatedSprite(NPCActor, "BlueHealer", "primary");
        //     npc.position.set(blue.healers[i][0], blue.healers[i][1]);
        //     npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

        //     this.healthbarManager.register(npc, npc.size.clone());

        //     npc.addAI(HealerBehavior);
        //     npc.animation.play("IDLE");
        //     this.battlers.push(npc);
        // }


    }
    /**
     * Initialize the items in the scene (healthpacks and laser guns)
     */
    protected initializeItems(): void {
        let laserguns = this.load.getObject("laserguns");
        this.laserguns = new Array<LaserGun>(laserguns.items.length);
        for (let i = 0; i < laserguns.items.length; i++) {
            let sprite = this.add.sprite("laserGun", "primary");
            let line = <Line>this.add.graphic(GraphicType.LINE, "primary", {start: Vec2.ZERO, end: Vec2.ZERO});
            this.laserguns[i] = LaserGun.create(sprite, line);
            this.laserguns[i].position.set(laserguns.items[i][0], laserguns.items[i][1]);
        }

        let healthpacks = this.load.getObject("healthpacks");
        this.healthpacks = new Array<Healthpack>(healthpacks.items.length);
        for (let i = 0; i < healthpacks.items.length; i++) {
            let sprite = this.add.sprite("healthpack", "primary");
            this.healthpacks[i] = new Healthpack(sprite);
            this.healthpacks[i].position.set(healthpacks.items[i][0], healthpacks.items[i][1]);
        }
    }
    /**
     * Initializes the navmesh graph used by the NPCs in the HW3Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * @author PeteyLumpkins
     */
    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        // Select A* as our navigation strategy
        navmesh.setStrategy("astar");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public getBattlers(): HW3Battler[] {
        return this.battlers;
    }

    public getWalls(): OrthogonalTilemap {
        return this.walls;
    }

    public getHealthpacks(): Healthpack[] {
        return this.healthpacks;
    }

    public getLaserGuns(): LaserGun[] {
        return this.laserguns;
    }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

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

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }
}