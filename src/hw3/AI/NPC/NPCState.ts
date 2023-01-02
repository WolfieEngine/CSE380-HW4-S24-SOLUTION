import State from "../../../Wolfie2D/DataTypes/State/State";
import NPCActor from "./NPCActor";
import NPCBehavior from "./NPCBehavior";

/**
 * An abstract state for the an NPCBehavior. The NPCs for HW3 use GOAP for their behavior. GOAP is
 * typically wrapped inside of a simple FSM. My implementation uses three states:
 *      
 *  1. Planning
 *  2. Moving
 *  3. Acting
 *  
 * I've based my implementation of a GOAP FSM on several of Jeff Orkins research papers on GOAP from
 * the early 2000s, as well as a few misc articles I've read online over the past year.
 */
export default abstract class NPCState extends State {

    /** The NPCs AI */
    protected parent: NPCBehavior;
    /** The NPCs Actor */
    protected actor: NPCActor;
    
    constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent);
        this.actor = actor;
    }
}