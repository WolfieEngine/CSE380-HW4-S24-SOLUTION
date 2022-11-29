import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import LaserGun from "../../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import NPCGoapAI from "../../NPCGoapAI";
import TargetAction from "./TargetAction";

class TargetFirstLaserGun extends TargetAction {
    getTarget(npc: NPCGoapAI): GameNode {
        let item: Item | null = npc.world.items.findItem((item: Item) => item.type.constructor === LaserGun && item.inv === null);
        return item === null ? null : item.owner;
    }
}

class TargetClosestLaserGun extends TargetAction {
    getTarget(npc: NPCGoapAI): GameNode {
        let items: Item[] = npc.world.items.findItems((item: Item) => item.type.constructor === LaserGun && item.inv === null);
        if (items.length > 0) {
            return items.reduce((prev: Item, curr: Item, idx: number, arr: Item[]): Item => {
                if (prev.owner.position.distanceSqTo(npc.position) < curr.owner.position.distanceSqTo(npc.position)) {
                    return prev;
                } else {
                    return curr;
                }
            }).owner;
        }
        return null;
    }
}

export {
    TargetFirstLaserGun, 
    TargetClosestLaserGun
}