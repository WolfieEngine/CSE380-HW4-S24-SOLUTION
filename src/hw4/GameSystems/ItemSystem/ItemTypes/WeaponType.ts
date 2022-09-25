import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Layer from "../../../../Wolfie2D/Scene/Layer";
import ItemType from "./ItemType";

export default interface WeaponType extends ItemType {

    get damage(): number;

    hits(user: GameNode, dir: Vec2): Array<GameNode>;
    
    animate(user: GameNode, dir: Vec2): void;
}