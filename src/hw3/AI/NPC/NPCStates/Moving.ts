import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import NPCState from "../NPCState";
import NPCBehavior from "../NPCBehavior";
import NPCActor from "../NPCActor";
import NPCAction from "../NPCActions/NPCAction";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";


export default class Moving extends NPCState {

    protected action: NPCAction;
    protected target: Vec2;

    protected path: NavigationPath;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.action = null;
        this.path = null;
        this.target = null;
    }
    
    public onEnter(options: Record<string, any>): void {
        // If the plan is empty that's bad -> should get a new plan
        if (this.parent.getPlan().isEmpty()) {
            this.finished("PLANNING");
        }
        // Otherwise, get the next action we should perform
        else {
            this.action = this.parent.getPlan().peek();
            this.target = this.action.target;
            this.path = this.actor.getPath(this.actor.position, this.target);
        }
    }

    public handleInput(event: GameEvent): void { }

    public update(deltaT: number): void {

        // Get the target location 
        let target = this.action.target;

        // If the target location has changed - update the path to the target from the actor's position
        if (!this.target.equals(target)) {
            this.target = target;
            this.path = this.actor.getPath(this.actor.position, this.target);
        }

        // If we're within range of the target, perform the action
        if (this.target.distanceTo(this.actor.position) <= this.action.range) {
            this.finished("ACTING");
        } 
        // Otherwise move toward the target location
        else {
            this.actor.moveOnPath(this.actor.speed*deltaT*10, this.path);
        }
    }

    public onExit(): Record<string, any> {
        return {}
    }
    
}