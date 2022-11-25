import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Battler from "../../../../GameSystems/BattleSystem/Battlers/Battler";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";
import TargetAction from "./TargetAction";

class TargetFirstEnemy extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode {
        let battler: Battler | null = npc.world.battlers.find((battler: Battler) => battler.group !== npc.battler.group);
        return battler === null ? null : battler.owner;
    }
    
}

class TargetClosestEnemy extends TargetAction {
    getTarget(npc: NPCGoapAI): GameNode {
        let battlers: Battler[] = npc.world.battlers.findAll((battler: Battler) => battler.group !== npc.battler.group);
        if (battlers.length <= 0) return null;

        return battlers.reduce((prev: Battler, curr: Battler): Battler => {
            if (prev.owner.position.distanceSqTo(npc.position) < curr.owner.position.distanceSqTo(npc.position)) {
                return prev;
            } else {
                return curr;
            }
        }).owner;
    }
}

class TargetClosestVisibleEnemy extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode {
        let battlers: Battler[] = npc.world.battlers.findAll((battler: Battler) => {
            return battler.group !== npc.battler.group && npc.isTargetVisible(battler.owner.position);
        });
        if (battlers.length <= 0) return null;
        return battlers.reduce((prev: Battler, curr: Battler): Battler => {
            if (prev.owner.position.distanceSqTo(npc.position) < curr.owner.position.distanceSqTo(npc.position)) {
                return prev;
            } else {
                return curr;
            }
        }).owner;
    }
    
}

export {
    TargetFirstEnemy,
    TargetClosestEnemy, 
    TargetClosestVisibleEnemy
}