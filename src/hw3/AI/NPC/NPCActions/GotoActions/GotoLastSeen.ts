import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import NPCGoapAI from "../../NPCGoapAI";
import GotoAction from "./GotoAction";

export default class GotoCurrent extends GotoAction {

    protected next: Vec2 | null = null;
    
    getRange(npc: NPCGoapAI): number {
        return 625;
    }

    performAction(npc: NPCGoapAI): GoapActionStatus {
        if (npc.isTargetVisible(npc.target.position)) {
            this.next = this.next === null ? this.path.next() : this.next;
            npc.location.copy(npc.target.position);
            let next = this.path.next();
            this.path = !this.next.equals(next) ? npc.getPath(npc.target.position) : this.path;
            this.next = !this.next.equals(next) ? null : this.next;
        }
        return super.performAction(npc);
    }

    getLocation(npc: NPCGoapAI): Vec2 {
        return npc.location;
    }
    
}