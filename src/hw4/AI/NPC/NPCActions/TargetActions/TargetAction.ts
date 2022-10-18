import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import { GoapActionStatus } from "../../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

export default abstract class TargetEnemy extends NPCAction {

    protected target: GameNode | null = null;
    protected location: Vec2 | null = null;

    performAction(npc: NPCGoapAI): GoapActionStatus {
        npc.target = this.target;
        npc.location = this.location;
        return this.target === null ? GoapActionStatus.FAILURE : GoapActionStatus.SUCCESS;
    }
    reset(npc: NPCGoapAI): void {
        
    }
    update(npc: NPCGoapAI): void {
        
    }
    checkPreconditions(npc: NPCGoapAI, status: string[]): boolean {
        this.target = this.getTarget(npc);
        this.location = this.target !== null ? this.target.position.clone() : null;
        return super.checkPreconditions(npc, status) && this.target !== null;
    }

    abstract getTarget(npc: NPCGoapAI): GameNode;
    
}