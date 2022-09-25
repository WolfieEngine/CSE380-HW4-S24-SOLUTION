import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GoapAI from "../../Wolfie2D/DataTypes/Interfaces/GoapAI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

export default class NPCAI extends StateMachineAI implements AI {

    public owner: GameNode;


    public initializeAI(owner: GameNode, opts: Record<string, any>): void {
        this.owner = owner;
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
    }


}