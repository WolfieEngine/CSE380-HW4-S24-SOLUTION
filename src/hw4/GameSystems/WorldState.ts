import GameNode from "../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattleManager from "./BattleSystem/BattleManager";
import ItemManager from "./ItemSystem/ItemManager";

export default class HW3WorldState {

    protected static _instance: HW3WorldState | undefined;

    protected _player: GameNode | null;
    protected _battlers: BattleManager | null;
    protected _items: ItemManager | null;
    protected _walls: OrthogonalTilemap | null;

    private constructor() {
        this._player = null;
        this._battlers = null;
        this._items = null;
    }

    public static instance(): HW3WorldState {
        if (this._instance === undefined) {
            this._instance = new HW3WorldState();
        }
        return this._instance;
    }

    public initialize(options: HW3WorldStateOptions): void {
        this._player = options.player;
        this._battlers = options.battlers;
        this._items = options.items;
        this._walls = options.walls;
    }
    
    public get player(): GameNode { return this._player; }
    public get battlers(): BattleManager { return this._battlers; }
    public get items(): ItemManager { return this._items; }
    public get walls(): OrthogonalTilemap { return this._walls; }
}

interface HW3WorldStateOptions {
    player: GameNode,
    battlers: BattleManager,
    items: ItemManager,
    walls: OrthogonalTilemap
}

