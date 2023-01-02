import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import HW3Scene from "../../Scenes/HW3Scene";
import Inventory from "./Inventory";


export default abstract class HW3Item {

    protected sprite: Sprite;

    protected _inventory: Inventory | null;


    protected emitter: Emitter;

    public constructor(sprite: Sprite){ 
        this.sprite = sprite;
        this._inventory = null;
        this.emitter = new Emitter();
    }

    public get id(): number { return this.sprite.id; }

    public get position(): Vec2 { return this.sprite.position; }

    public get visible(): boolean { return this.sprite.visible; }
    public set visible(value: boolean) { this.sprite.visible = value; }

    public get inventory(): Inventory | null { return this._inventory; }
    public set inventory(value: Inventory | null) { this._inventory = value; }

}