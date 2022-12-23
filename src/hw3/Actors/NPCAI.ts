import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import NPCActor from "../AI/NPC/NPCActor";

export default class NPCAI extends StateMachineAI {

    protected owner: NPCActor;
    
    public initializeAI(owner: NPCActor, config: Record<string, any>): void {
        this.owner = owner;
    }

}