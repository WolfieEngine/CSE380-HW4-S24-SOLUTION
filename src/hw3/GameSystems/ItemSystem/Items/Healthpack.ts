import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import HW3Scene from "../../../Scenes/HW3Scene";
import Item from "../Item";

export default class Healthpack extends Item {
    
    protected hp: number;

    protected constructor(sprite: Sprite) {
        super(sprite);
        this.hp = 5;
    }

    public static create(sprite: Sprite): Healthpack {
        return new Healthpack(sprite);
    }

    public get health(): number { return this.hp; }
    public set health(hp: number) { this.hp = hp; }


}