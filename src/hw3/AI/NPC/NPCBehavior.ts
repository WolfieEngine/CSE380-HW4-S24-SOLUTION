import StateMachineGoapAI from "../../../Wolfie2D/AI/Goap/StateMachineGoapAI";
import NPCAction from "./NPCActions/NPCAction";
import NPCActor from "./NPCActor";

import Acting from "./NPCStates/Acting";
import Planning from "./NPCStates/Planning";
import Moving from "./NPCStates/Moving";

/**
 * An abstract implementation of behavior for an NPC. Each concrete implementation of the
 * NPCBehavior class should define some new behavior for an NPCActor. 
 */
export default abstract class NPCBehavior extends StateMachineGoapAI<NPCAction>  {

    /** The GameNode that owns this NPCGoapAI */
    protected owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        this.addState("PLANNING", new Planning(this, this.owner));
        this.addState("MOVING", new Moving(this, this.owner));
        this.addState("ACTING", new Acting(this, this.owner));

        this.initialize("PLANNING");
    }

}