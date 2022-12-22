import GameNode from "../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattleManager from "./BattleSystem/BattleManager";
import ItemManager from "./ItemSystem/ItemManager";

/**
 * The HW3WorldState is a singleton that our NPCs can hook into. Personally I don't like this class. The "problem"
 * I'm having is that the NPCs need to know about the other battlers, the items, the player, etc. These things all
 * exist in the HW3Scene, so in theory, I could pass them all as options to every single NPC AI, but that doesn't
 * feel right. I could get them by casting the AIs owner's scene to the HW3Scene, so something like this...
 * 
 *      (<HW3Scene>this.owner.scene).battlers.find(...)
 * 
 * But doing this casting also doesn't feel right. One of the issues Wolfie2D has is the inability to create 
 * specific GameNodes for specific Scenes. Going forward, we should look into a way to create a more 
 * generified GameNode and Scene class/interface structure that allows other programmers to create specialized nodes 
 * for specific scenes.
 * 
 * Not to go off more, but one of the problems I've run into while making this assignment is that there's a lot of 
 * code in my PlayerAI and NPCGoapAI classes that shouldn't be there. The AI classes are suppossed to define a specific
 * BEHAVIOR for a specific ACTOR. However, creating specific ACTORs is limited, which leads to a lot of custom ACTOR 
 * code gunking up the AI code.
 * 
 * @author PeteyLumpkins 
 */
export default class HW3WorldState {

    /** The instance of the HW3WorldState */
    protected static _instance: HW3WorldState | undefined;
    /** The player's GameNode */
    protected _player: GameNode | null;
    /** The battlers in the world */
    protected _battlers: BattleManager | null;
    /** All the items in the world */
    protected _items: ItemManager | null;
    /** The tilemap node that has the walls */
    protected _walls: OrthogonalTilemap | null;

    private constructor() {
        this._player = null;
        this._battlers = null;
        this._items = null;
        this._walls = null;
    }

    public static instance(): HW3WorldState {
        if (this._instance === undefined) {
            this._instance = new HW3WorldState();
        }
        return this._instance;
    }

    /**
     * Initializes the HW3WorldState
     * @param options 
     */
    public initialize(options: HW3WorldStateOptions): void {
        this._player = options.player ? options.player : null;
        this._battlers = options.battlers ? options.battlers : null;
        this._items = options.items ? options.items : null;
        this._walls = options.walls ? options.walls : null;
    }
    
    public get player(): GameNode { return this._player; }
    public get battlers(): BattleManager { return this._battlers; }
    public get items(): ItemManager { return this._items; }
    public get walls(): OrthogonalTilemap { return this._walls; }
}

/**
 * A set of options the HW3WorldState can be initialized with
 */
interface HW3WorldStateOptions {
    player: GameNode,
    battlers: BattleManager,
    items: ItemManager,
    walls: OrthogonalTilemap
}

