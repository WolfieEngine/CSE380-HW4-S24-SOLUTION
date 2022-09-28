import PlayerController from "../AI/PlayerController";
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
import PlayerBattler from "../GameSystems/BattleSystem/Battlers/PlayerBattler";
import NPCBattler from "../GameSystems/BattleSystem/Battlers/NPCBattler";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import NPCBehavior from "../AI/NPCGoapAI";
import Weapon from "../GameSystems/ItemSystem/Items/Weapon";
import LaserGun from "../GameSystems/ItemSystem/ItemTypes/LaserGun";
import InventoryHUD from "../UI/InventoryHUD";
import PlayerAI from "../AI/PlayerAI";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import { Debugger } from "../Debugger";
import HealthPack from "../GameSystems/ItemSystem/ItemTypes/HealthPack";
import Consumable from "../GameSystems/ItemSystem/Items/Consumable";


export default class hw4_scene extends Scene {

    /** GameSystems in the HW4 Scene */
    private battleManager: BattleManager;
    private itemManager: ItemManager;
    private healthbarManager: HealthbarManager;
    private inventoryHud: InventoryHUD;

    /** GameNodes in the HW4 Scene */
    private player: AnimatedSprite;
    private npcs: Array<AnimatedSprite>;
    private consumables: Array<Sprite>;
    private weapons: Array<Sprite>

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;


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
        this.load.tilemap("level", "hw4_assets/tilemaps/cse380_hw4_tilejson.json");

        // Load the scene info
        this.load.object("weaponData", "hw4_assets/data/weaponData.json");

        // Load the nav mesh
        this.load.object("navmesh", "hw4_assets/data/navmesh.json");

        // Load in the enemy info
        this.load.object("enemyData", "hw4_assets/data/enemy.json");

        // Load in item info
        this.load.object("itemData", "hw4_assets/data/items.json");

        // Load the healthpack sprite
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("knife", "hw4_assets/sprites/knife.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
        this.load.image("pistol", "hw4_assets/sprites/pistol.png");
        
    }

    startScene(){
        // Debugger.enable("battler");
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level", new Vec2(0.5, 0.5));

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size.scaled(0.5);

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(2);

        this.initLayers();
        this.initSubsystems();
        // Create the player
        this.initPlayer();
        this.initItems();

        this.viewport.follow(this.player);

        // Create the NPCS
        this.initNPCs();
        console.log("Test");

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(hw4_Events.UNLOAD_ASSET);

        // Add a UI for health
        this.addUILayer("health");

        this.createNavmesh();

        Debugger.enable("battler");
        Debugger.enable("health")

    }

    updateScene(deltaT: number): void { 
        this.healthbarManager.update(deltaT);
        this.itemManager.update(deltaT);
        this.battleManager.update(deltaT);
        this.inventoryHud.update(deltaT);
    }

    initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("slots");
        this.addUILayer("items");

        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }

    initSubsystems(): void {
        this.healthbarManager = new HealthbarManager(this, "primary");
        this.inventoryHud = new InventoryHUD(this, 9, 8, new Vec2(232, 24), "items", "inventorySlot", "slots")
        this.itemManager = new ItemManager()
        this.battleManager = new BattleManager();
    }

    initPlayer(): void {
        this.player = this.add.animatedSprite("player1", "primary");
        this.player.position.set(4*8, 62*8);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        let battler: PlayerBattler | null = this.battleManager.register(PlayerBattler, this.player, {
            health: 2,
            maxHealth: 5,
            speed: 1
        });
        let inventory: Inventory | null = this.itemManager.registerInventory(this.player, []);
        this.healthbarManager.addHealthbar(this.player, this.player.size.clone());

        this.player.addAI(PlayerAI, {battler: battler, inventory: inventory});

        this.player.animation.play("IDLE");
    }

    initNPCs(): void {
        this.npcs = new Array<AnimatedSprite>(1);
        for (let i = 0; i < this.npcs.length; i++) {
            this.npcs[i] = this.add.animatedSprite("gun_enemy", "primary");
            this.npcs[i].position.set(4*12, 62*8);
            this.npcs[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

            let battler: NPCBattler | null = this.battleManager.register(NPCBattler, this.npcs[i], {
                health: 5,
                maxHealth: 5,
                speed: 1
            });
            let inventory: Inventory | null = this.itemManager.registerInventory(this.npcs[i], []);
            this.healthbarManager.addHealthbar(this.npcs[i], this.npcs[i].size.clone());

            this.npcs[i].addAI(NPCBehavior, {battler: battler, inventory: inventory});

            this.npcs[i].animation.play("IDLE");
        }
    }

    /**
     * 
     */
    initItems(): void {
        let items = this.load.getObject("itemData");
        this.weapons = new Array<Sprite>(items.items.length);
        for (let i = 0; i < items.items.length; i++) {
            this.weapons[i] = this.add.sprite("laserGun", "primary")
            this.weapons[i].position.set(items.items[i].position[0], items.items[i].position[1]);
            this.itemManager.registerItem(Weapon, this.weapons[i], new LaserGun(this, "test", 3));
        }

        this.consumables = new Array<Sprite>(1);
        for (let i = 0; i < 1; i++) {
            this.consumables[i] = this.add.sprite("healthpack", "primary");
            this.consumables[i].position.copy(this.player.position);
            this.itemManager.registerItem(Consumable, this.consumables[i], new HealthPack(this, "test", 3));
        }
    }

    /**
     * 
     */


    createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.graph.addPositionedNode(new Vec2(node[0]/2, node[1]/2));
            this.add.graphic(GraphicType.POINT, "graph", {position: new Vec2(node[0]/2, node[1]/2)})
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.graph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(edge[0]), end: this.graph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);

        this.navManager.addNavigableEntity(hw4_Names.NAVMESH, navmesh);
    }
}