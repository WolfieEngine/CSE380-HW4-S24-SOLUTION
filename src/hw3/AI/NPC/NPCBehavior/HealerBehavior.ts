import NPCActor from "../NPCActor";
import PickupHealthpack from "../NPCActions/PickupItemActions/PickupHealthpack";
import HealthpackExists from "../NPCStatuses/HeathpackExists";
import HasHealthpack from "../NPCStatuses/HasHealthpack";
import IdleAction from "../NPCActions/IdleAction";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/GoalReached";
import HealAlly from "../NPCActions/UseItemActions/UseHealthpack/HealAlly";

/**
 * When an NPC is acting as a healer, their goal is to try and heal it's teammates by running around, picking up healthpacks, 
 * bringing to the healthpacks to their allies and healing them.
 */
export default class HealerBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        /* ######### Add all healer statuses ######## */

        this.addStatus(new GoalReached("goal"));
        this.addStatus(new HealthpackExists("hpack-exists"));
        this.addStatus(new HasHealthpack("has-hpack"));
        
        /* ######### Add all healer actions ######## */

        // Pickup healthpack
        let pickupHealthpack = new PickupHealthpack("pickup-hpack");
        pickupHealthpack.addPrecondition("hpack-exists");
        pickupHealthpack.addEffect("has-hpack");
        pickupHealthpack.cost = 10;
        this.addAction(pickupHealthpack);

        // Heal ally
        let healAlly = new HealAlly("heal-ally");
        healAlly.addPrecondition("has-hpack");
        healAlly.addEffect("goal");
        healAlly.cost = 5;
        this.addAction(healAlly);

        // Idle
        let idle = new IdleAction("idle");
        idle.addEffect("goal");
        idle.cost = 100;
        this.addAction(idle);

        /* ######### Set the healer's goal ######## */

        this.goal = "goal";
    
        super.initializeAI(owner, opts);
    }

}