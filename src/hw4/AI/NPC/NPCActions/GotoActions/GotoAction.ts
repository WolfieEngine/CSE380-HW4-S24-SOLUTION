import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../../../../Wolfie2D/Pathfinding/NavigationPath";
import { GoapActionStatus } from "../../../../GameSystems/GoapSystem/GoapAction";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

export default abstract class GotoAction extends NPCAction {
    
    protected path: NavigationPath | null = null;

    update(npc: NPCGoapAI): void {
    
    }

    performAction(npc: NPCGoapAI): GoapActionStatus {
        if (this.path.isDone() || npc.position.distanceSqTo(this.getLocation(npc)) <= this.getRange(npc)) {
            return GoapActionStatus.SUCCESS;
        }
        npc.moveOnPath(npc.battler.speed, this.path);
        return GoapActionStatus.RUNNING;
    }

    reset(npc: NPCGoapAI): void {
        this.path = npc.getPath(this.getLocation(npc));
    }

    checkPreconditions(npc: NPCGoapAI, status: string[]): boolean {
        return super.checkPreconditions(npc, status);
    }

    abstract getRange(npc: NPCGoapAI): number;

    abstract getLocation(npc: NPCGoapAI): Vec2;

}