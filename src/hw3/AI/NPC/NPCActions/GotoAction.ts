import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import Finder from "../../../GameSystems/Searching/BasicFinder";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";

export default class GotoAction extends NPCAction {

    // The entity we're targeting - could be another NPC, the player, an item, or something else?
    protected target: TargetableEntity | null;
    // The path from the NPC to the target
    protected path: NavigationPath | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.target = null;
        this.path = null;
    }

    public onEnter(options: Record<string, any>): void {
        // If the actor has a target - set the target and get a path to the target
        if (this.actor.hasTarget()) {
            // Get the target
            this.target = this.actor.getTarget();
            // Construct a path from the actor to the target
            this.path = this.actor.getPath(this.actor.position, this.target.position);
        }
    }

    public update(deltaT: number): void {
        // If the target is null or the NPC has reached the target, then we're done!
        if (this.target === null || this.actor.atTarget() || this.path === null || this.path.isDone()) {
            this.finished();
        } 
        // Otherwise move on the path toward the target
        else {
            this.actor.moveOnPath(this.actor.speed*deltaT*10, this.path);
        }
    }

    public onExit(): Record<string, any> {
        // Clear the references to the target and the path
        this.target = null;
        this.path = null;
        return {};
    }
    
}