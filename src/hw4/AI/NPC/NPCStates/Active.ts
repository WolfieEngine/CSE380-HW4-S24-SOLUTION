import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCState from "./NPCState";

export default class Active extends NPCState {

    onEnter(options: Record<string, any>): void { super.onEnter(options); }
    
    handleInput(event: GameEvent): void { super.handleInput(event); }

    update(deltaT: number): void { super.update(deltaT); }

    onExit(): Record<string, any> { return super.onExit(); }
    
}