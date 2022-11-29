import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCState from "./NPCState";

/**
 * The Active state for the NPC AI. While an NPC is active, it should execute it's GOAP plan
 * and handle all incoming events from the rest of the game.
 */
export default class Active extends NPCState {

    onEnter(options: Record<string, any>): void { super.onEnter(options); }
    
    handleInput(event: GameEvent): void { super.handleInput(event); }

    update(deltaT: number): void { 
        super.update(deltaT);
        this.parent.goap.update(deltaT); 
    }

    onExit(): Record<string, any> { return super.onExit(); }
    
}