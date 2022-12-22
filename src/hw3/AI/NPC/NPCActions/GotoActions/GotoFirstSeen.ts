import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import NPCGoapAI from "../../NPCGoapAI";
import GotoAction from "./GotoAction";

export default class MeleeRange extends GotoAction {

    getLocation(npc: NPCGoapAI): Vec2 {
        return npc.target.position.clone();
    }
    
    getRange(npc: NPCGoapAI): number {
        return 625;
    }
    
}