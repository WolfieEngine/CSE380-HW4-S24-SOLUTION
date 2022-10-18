import GameNode from "../../../../../../Wolfie2D/Nodes/GameNode";
import Battler from "../../../../../GameSystems/BattleSystem/Battlers/Battler";
import NPCGoapAI from "../../../NPCGoapAI";
import TargetAlly from "./TargetAlly";

export default class LowHealth extends TargetAlly {

    getTarget(npc: NPCGoapAI): GameNode { 
        let battler: Battler | null = npc.world.battlers.find((battler: Battler) => {
            return battler.group === npc.battler.group && battler.health < battler.maxHealth * 0.5;
        });
        return battler === null ? null : battler.owner;
    }
}