import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Finder from "../../../GameSystems/Searching/Finder";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";

export default class TargetAction extends NPCAction {

    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected targetFinder: Finder<TargetableEntity>;
    // The targets or Targetable entities 
    protected targets: TargetableEntity[];
    // The target we are going to set the actor to target
    protected target: TargetableEntity | null;

    public constructor(parent: NPCBehavior, actor: NPCActor, targets: TargetableEntity[], targetFinder: Finder<TargetableEntity>) {
        super(parent, actor);
        this.targets = targets;
        this.targetFinder = targetFinder;
        this.target = null;
    }

    onEnter(options: Record<string, any>): void {
        // Select the target our actor should move towards
        this.target = this.targetFinder.find(this.targets);
    }

    update(deltaT: number): void {
        // If the target is not null - start targeting the target
        if (this.target !== null) {
            this.actor.setTarget(this.target);
        }

        this.finished();
    }

    onExit(): Record<string, any> {
        this.target = null;
        return {};
    }
    
}