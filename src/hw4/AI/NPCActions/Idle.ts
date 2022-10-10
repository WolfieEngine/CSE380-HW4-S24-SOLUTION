import { GoapActionStatus } from "../Goap/GoapAction";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class Guard extends NPCAction<Record<string, any>> {

    init(options: Record<string, any>): void { }
    start(ai: NPCGoapAI): void { }
    run(ai: NPCGoapAI): GoapActionStatus { 
        console.log("Running guard action");
        return GoapActionStatus.SUCCESS; 
    }
    stop(ai: NPCGoapAI): void { }
    checkProceduralPreconditions(ai: NPCGoapAI): boolean { return true; }
    
}