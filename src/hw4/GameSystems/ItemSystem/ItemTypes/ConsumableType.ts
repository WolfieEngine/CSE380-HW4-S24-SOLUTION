import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import ItemType from "./ItemType";

export default interface ConsumableType extends ItemType {
    
    get effects(): Record<string, any>;

    animate(consumer: GameNode): void;
}