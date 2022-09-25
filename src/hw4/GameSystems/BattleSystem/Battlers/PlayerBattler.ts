import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Battler from "./Battler";
import BattlerType from "../BattlerType";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";

export default class PlayerBattler extends Battler {

    public constructor(owner: GameNode, type: BattlerType) {
        super(owner, type);
    }

    public override handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
}