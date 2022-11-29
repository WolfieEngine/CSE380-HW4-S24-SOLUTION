import { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

/**
 * An Idle action for the NPCGoapAI. Basically a default action for all of the NPCs
 * to do nothing.
 */
export default class IdleAction extends NPCAction {

    update(ai: NPCGoapAI): void { }

    performAction(ai: NPCGoapAI): GoapActionStatus { return GoapActionStatus.SUCCESS; }
    
    reset(ai: NPCGoapAI): void { }
    
}