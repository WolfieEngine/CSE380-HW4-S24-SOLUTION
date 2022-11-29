import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import NPCGoapAI from "../../NPCGoapAI";
import TargetAction from "./TargetAction";

export default class TargetPlayer extends TargetAction {

    getTarget(npc: NPCGoapAI): GameNode {
        return npc.world.player;
    }
    
}