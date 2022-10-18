import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { NPCEvent } from "../../../Events";
import NPCState from "./NPCState";

export default class Dead extends NPCState {
    
    onEnter(options: Record<string, any>): void { this.emitter.fireEvent(NPCEvent.NPC_KILLED); }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }
}