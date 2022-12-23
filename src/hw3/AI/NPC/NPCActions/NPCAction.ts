import GoapAction, { GoapActionStatus } from "../../../../Wolfie2D/AI/Goap/GoapAction";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import NPCActor from "../NPCActor";

/**
 * An abstract GoapAction for an NPCGoapAI
 */
export default abstract class NPCAction extends GoapAction {

    /** Performs the GoapAction on the given actor */
    public abstract performAction(actor: NPCActor): GoapActionStatus;

    /** Plans the action */
    public abstract planAction(actor: NPCActor): void;

    /** Gets the location where this actor should be before performing the action */
    public abstract getTarget(actor: NPCActor): Vec2;

    /** Gets the distance this actor should be from the target location */
    public abstract getRange(actor: NPCActor): number;
}
