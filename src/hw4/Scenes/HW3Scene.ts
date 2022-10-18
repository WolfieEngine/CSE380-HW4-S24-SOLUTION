import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import {hw4_Events, hw4_Names} from "../hw4_constants";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleSystem/BattleManager";
import HealthbarManager from "../UI/HealthbarManager";
import ItemManager from "../GameSystems/ItemSystem/ItemManager";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import NPCBehavior from "../AI/NPC/NPCGoapAI";
import Weapon from "../GameSystems/ItemSystem/Items/Weapon";
import LaserGun from "../GameSystems/ItemSystem/ItemTypes/LaserGun";
import InventoryHUD from "../UI/InventoryHUD";
import PlayerAI from "../AI/Player/PlayerAI";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import { Debugger } from "../Debugger";
import HealthPack from "../GameSystems/ItemSystem/ItemTypes/HealthPack";
import Consumable from "../GameSystems/ItemSystem/Items/Consumable";

import HW3WorldState from "../GameSystems/WorldState";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";

import NPCAction from "../AI/NPC/NPCActions/NPCAction";
import GoapObject from "../GameSystems/GoapSystem/GoapObject";
import NPCGoapAI from "../AI/NPC/NPCGoapAI";
import NPCGoapFactory, { NPCGoapType } from "../AI/NPC/NPCGoapFactory";

import { ItemEvent, NPCEvent, PlayerEvent } from "../Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameOver from "./GameOver";
import Battler from "../GameSystems/BattleSystem/Battlers/Battler";
import Wand from "../GameSystems/ItemSystem/ItemTypes/Wand";


export default class HW3Scene extends Scene {

    /** GameSystems in the HW3 Scene */
    private battleManager: BattleManager;
    private itemManager: ItemManager;
    private healthbarManager: HealthbarManager;
    private inventoryHud: InventoryHUD;

    /** GameNodes in the HW3 Scene */
    private player: AnimatedSprite;
    private npcs: Array<AnimatedSprite>;
    private consumables: Array<Sprite>;
    private weapons: Array<Sprite>

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    private world: HW3WorldState;


    loadScene(){
        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/player1.json");
        this.load.spritesheet("player2", "hw4_assets/spritesheets/player2.json");

        this.load.spritesheet("gun_enemy", "hw4_assets/spritesheets/gun_enemy.json");
        this.load.spritesheet("knife_enemy", "hw4_assets/spritesheets/knife_enemy.json");
        this.load.spritesheet("custom_enemy1", "hw4_assets/spritesheets/custom_enemy1.json");
        this.load.spritesheet("custom_enemy2", "hw4_assets/spritesheets/custom_enemy2.json");

        this.load.spritesheet("slice", "hw4_assets/spritesheets/slice.json");

        // Load the tilemap
        // HOMEWORK 4 - TODO
        // Change this file to be your own tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/HW3Map2.json");

        this.load.object("enemies", "hw4_assets/data/enemies.json")
        this.load.object("healthpacks", "hw4_assets/data/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/laserguns.json");

        // Load the nav mesh
        this.load.object("navmesh", "hw4_assets/data/navmesh3.json");

        // Load the healthpack sprite
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("knife", "hw4_assets/sprites/knife.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
        this.load.image("pistol", "hw4_assets/sprites/pistol.png");
        
    }

    startScene(){
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

        // Create the NPCS
        this.initializeNPCs();

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(hw4_Events.UNLOAD_ASSET);

        // Add a UI for health
        this.addUILayer("health");

        this.initializeNavmesh();

        this.world.initialize({
            player: this.player,
            battlers: this.battleManager,
            items: this.itemManager,
            walls: this.walls
        });

        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(NPCEvent.NPC_KILLED);
    }

    public updateScene(deltaT: number): void { 
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.healthbarManager.update(deltaT);
        this.itemManager.update(deltaT);
        this.battleManager.update(deltaT);
        this.inventoryHud.update(deltaT);
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
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

    protected handlePlayerKilled(event: GameEvent): void {
        this.emitter.fireEvent(GameEventType.CHANGE_SCENE, {scene: GameOver, init: {}});
    }
    protected handleNPCKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        this.battleManager.unregister(id);
        this.itemManager.unregisterInventory(id);
        this.sceneGraph.getNode(id).destroy();
    }

    initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("slots");
        this.addUILayer("items");

        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }

    public initializeSystems(): void {
        this.healthbarManager = new HealthbarManager(this, "primary");
        this.inventoryHud = new InventoryHUD(this, 9, 8, new Vec2(232, 24), "items", "inventorySlot", "slots")
        this.itemManager = new ItemManager()
        this.battleManager = new BattleManager();
        this.world = HW3WorldState.instance();
    }

    protected initializePlayer(): void {
        this.player = this.add.animatedSprite("player1", "primary");
        this.player.position.set(40, 40);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        let battler: Battler | null = this.battleManager.register(Battler, this.player, {
            health: 200,
            maxHealth: 200,
            speed: 1,
            group: 0
        });
        let inventory: Inventory | null = this.itemManager.registerInventory(this.player, []);
        this.healthbarManager.addHealthbar(this.player, this.player.size.clone());

        this.player.addAI(PlayerAI, {battler: battler, inventory: inventory});

        this.player.animation.play("IDLE");
    }
    protected initializeNPCs(): void {
        let enemies: Record<string, any> = this.load.getObject("enemies");
        this.npcs = new Array<AnimatedSprite>(enemies.enemies.length);
        for (let i = 0; i < 8; i++) {
            this.npcs[i] = this.add.animatedSprite("gun_enemy", "primary");
            this.npcs[i].position.set(enemies.enemies[i][0], enemies.enemies[i][1]);
            this.npcs[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            let battler: Battler | null = this.battleManager.register(Battler, this.npcs[i], {
                health: 15,
                maxHealth: 15,
                speed: 1,
                group: 1
            });
            let inventory: Inventory | null = this.itemManager.registerInventory(this.npcs[i], []);
            this.healthbarManager.addHealthbar(this.npcs[i], this.npcs[i].size.clone());

            let goap: GoapObject<NPCGoapAI, NPCAction> = NPCGoapFactory.buildNPCGoap(NPCGoapType.DEFAULT);

            this.npcs[i].addAI(NPCBehavior, {
                navkey: "navmesh",
                battler: battler, 
                inventory: inventory,
                goap: goap,
                world: this.world
            });
            this.npcs[i].animation.play("IDLE");
        }

        for (let i = 8; i < this.npcs.length; i++) {
            this.npcs[i] = this.add.animatedSprite("gun_enemy", "primary");
            this.npcs[i].position.set(enemies.enemies[i][0], enemies.enemies[i][1]);
            this.npcs[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            let battler: Battler | null = this.battleManager.register(Battler, this.npcs[i], {
                health: 20,
                maxHealth: 20,
                speed: 1,
                group: 1
            });
            let inventory: Inventory | null = this.itemManager.registerInventory(this.npcs[i], []);
            this.healthbarManager.addHealthbar(this.npcs[i], this.npcs[i].size.clone());

            let goap: GoapObject<NPCGoapAI, NPCAction> = NPCGoapFactory.buildNPCGoap(NPCGoapType.HEALER);

            this.npcs[i].addAI(NPCBehavior, {
                navkey: "navmesh",
                battler: battler, 
                inventory: inventory,
                goap: goap,
                world: this.world
            });
            this.npcs[i].animation.play("IDLE");
        }
    }
    protected initializeItems(): void {
        let laserguns: Record<string, any> = this.load.getObject("laserguns");
        this.weapons = new Array<Sprite>(laserguns.items.length);
        for (let i = 0; i < laserguns.items.length; i++) {
            this.weapons[i] = this.add.sprite("laserGun", "primary")
            this.weapons[i].position.set(laserguns.items[i][0], laserguns.items[i][1]);
            this.itemManager.registerItem(Weapon, this.weapons[i], new LaserGun(this, "test", 3));
        }

        let healthpacks: Record<string, any> = this.load.getObject("healthpacks");
        this.consumables = new Array<Sprite>(healthpacks.items.length);
        for (let i = 0; i < healthpacks.items.length; i++) {
            this.consumables[i] = this.add.sprite("healthpack", "primary");
            this.consumables[i].position.set(healthpacks.items[i][0], healthpacks.items[i][1]);
            this.itemManager.registerItem(Consumable, this.consumables[i], new HealthPack(this, "test", 3));
        }

        let wand: Sprite = this.add.sprite("laserGun", "primary");
        wand.position.set(40, 100);
        this.itemManager.registerItem(Weapon, wand, new Wand(this, "test want", 0));
    }
    protected initializeNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        // gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
                // this.add.graphic(GraphicType.POINT, "graph", {position: tile.center});
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
                    this.graph.addEdge(i, i+1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i+dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }
                
                
            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        this.navManager.addNavigableEntity(hw4_Names.NAVMESH, navmesh);
    }
}