import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

export enum NPCStateType {
    ANIMATING = "ANIMATING",
    MOVING = "MOVING",
}

export default abstract class NPCState extends State {

    onEnter(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }
    handleInput(event: GameEvent): void {
        throw new Error("Method not implemented.");
    }
    update(deltaT: number): void {
        throw new Error("Method not implemented.");
    }
    onExit(): Record<string, any> {
        throw new Error("Method not implemented.");
    }
    
}