import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Battler from "../../../../GameSystems/BattleSystem/Battlers/Battler";
import NPCGoapAI from "../../NPCGoapAI";
import TargetAction from "./TargetAction";

export default class TargetVisibleEnemy extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode {
        let battler: Battler | null = npc.world.battlers.find((battler: Battler) => {
            return battler.group !== npc.battler.group && npc.isTargetVisible(battler.owner.position);
        });
        return battler === null ? null : battler.owner;
    }
    
}