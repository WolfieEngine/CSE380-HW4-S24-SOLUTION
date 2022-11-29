import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCGoapAI from "../../NPCGoapAI";
import TargetAction from "./TargetAction";

class TargetFirstHealthpack extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode | null {
        let item: Item | null = npc.world.items.findItem((item: Item) => item.type.constructor === HealthPack && item.inv === null);
        return item === null ? null : item.owner;
    }
    
}

class TargetClosestHealthpack extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode | null {
        let items: Item[] = npc.world.items.findItems((item: Item) => item.type.constructor === HealthPack && item.inv === null);
        if (items.length <= 0) return null;

        return items.reduce((prev: Item, curr: Item, idx: number, arr: Item[]): Item => {
            if (prev.owner.position.distanceSqTo(npc.position) < curr.owner.position.distanceSqTo(npc.position)) {
                return prev;
            } else {
                return curr;
            }
        }).owner;
    }
}

export { TargetClosestHealthpack, TargetFirstHealthpack }