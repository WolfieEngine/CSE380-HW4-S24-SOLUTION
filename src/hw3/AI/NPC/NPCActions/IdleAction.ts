import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCAction from "./NPCAction";

/**
 * An Idle action for the NPCGoapAI. Basically a default action for all of the NPCs
 * to do nothing.
 */
export default class IdleAction extends NPCAction {

    onEnter(options: Record<string, any>): void {}

    update(deltaT: number): void {
        this.finished();
    }

    onExit(): Record<string, any> { return {} }
    
}