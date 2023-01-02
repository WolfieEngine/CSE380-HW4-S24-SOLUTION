import IdleAction from "../NPCActions/IdleAction";
import PickupHealthpack from "../NPCActions/PickupItemActions/PickupHealthpack";
import PickupLaserGun from "../NPCActions/PickupItemActions/PickupLaserGun";
import HealAlly from "../NPCActions/UseItemActions/UseHealthpack/HealAlly";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/GoalReached";
import HasHealthpack from "../NPCStatuses/HasHealthpack";
import HasLaserGun from "../NPCStatuses/HasLaserGun";
import HealthpackExists from "../NPCStatuses/HeathpackExists";
import LaserGunExists from "../NPCStatuses/LaserGunExists";


export default class GruntBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        /* ######### Add all healer statuses ######## */

        this.addStatus(new GoalReached("goal"));
        this.addStatus(new LaserGunExists("lasergun-exists"));
        this.addStatus(new HasLaserGun("has-lasergun"));
        
        /* ######### Add all healer actions ######## */

        // Pickup healthpack
        let pickupLaserGun = new PickupLaserGun("pickup-lasergun");
        pickupLaserGun.addPrecondition("lasergun-exists");
        pickupLaserGun.addEffect("has-lasergun");

        // Heal ally
        

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