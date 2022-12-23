import { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import NPCActor from "../NPCActor";
import NPCAction from "./NPCAction";

/**
 * An Idle action for the NPCGoapAI. Basically a default action for all of the NPCs
 * to do nothing.
 */
export default class IdleAction extends NPCAction {

    public getTarget(actor: NPCActor): Vec2 {
        return actor.position;
    }
    public getRange(actor: NPCActor): number {
        return Number.POSITIVE_INFINITY;
    }

    public planAction(actor: NPCActor): void {}

    public performAction(actor: NPCActor): GoapActionStatus { return GoapActionStatus.SUCCESS; }
    
}