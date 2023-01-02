import IdleAction from "../NPCActions/IdleAction";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/GoalReached";

/**
 * Idle behavior for an NPC. The idle behavior can be given to an NPC to tell it to do... nothing!
 */
export default class IdleBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        // Add the goal status
        this.addStatus(new GoalReached("goal"));

        // Add the idle action
        let idle = new IdleAction("idle");
        idle.addEffect("goal");
        idle.cost = 100;
        this.addAction(idle);

        // Set the goal to idle
        this.goal = "goal";
    
        super.initializeAI(owner, opts);
    }

}