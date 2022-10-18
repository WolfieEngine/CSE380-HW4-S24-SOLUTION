import { GoapActionStatus } from "../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class IdleAction extends NPCAction {

    start(ai: NPCGoapAI): void { }

    update(ai: NPCGoapAI): void { }

    performAction(ai: NPCGoapAI): GoapActionStatus { return GoapActionStatus.SUCCESS; }
    
    reset(ai: NPCGoapAI): void { }
    
}