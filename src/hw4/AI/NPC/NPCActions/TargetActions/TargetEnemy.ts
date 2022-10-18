import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Battler from "../../../../GameSystems/BattleSystem/Battlers/Battler";
import NPCGoapAI from "../../NPCGoapAI";
import TargetAction from "./TargetAction";

export default class TargetEnemy extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode {
        let battler: Battler | null = npc.world.battlers.find((battler: Battler) => battler.group !== npc.battler.group);
        return battler === null ? null : battler.owner;
    }
    
}