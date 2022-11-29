import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { NPCEvent } from "../../../Events";
import NPCState from "./NPCState";

/**
 * The Dead State for NPCs. When the NPC enters the Dead state, it should alert the rest of the
 * system that this NPC is now dead and the NPC should stop 
 */
export default class Dead extends NPCState {
    
    onEnter(options: Record<string, any>): void { this.emitter.fireEvent(NPCEvent.NPC_KILLED); }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }
}