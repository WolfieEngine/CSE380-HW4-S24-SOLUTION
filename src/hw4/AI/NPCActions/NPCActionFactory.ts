import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import BattleManager from "../../GameSystems/BattleSystem/BattleManager";
import ItemManager from "../../GameSystems/ItemSystem/ItemManager";
import GoapPlan from "../Goap/GoapPlan";
import PickupHealthpack from "./PickupHealthpack";
import GotoPlayer from "./GotoPlayer";
import Guard from "./Idle";
import NPCAction from "./NPCAction";
import UseHealthPack from "./UseHealthPack";

export default class GoapPlanFactory {

    private actions: NPCActionFactory;

    constructor(player: GameNode, battlers: BattleManager, items: ItemManager) {
        this.actions = new NPCActionFactory(player, battlers, items);
    }

    build(type: string): GoapPlan<NPCAction<any>> {
        let goap = new GoapPlan<NPCAction<any>>("goal", [], [
            this.actions.build(NPCActionType.GOTO_PLAYER, 5, [], ["goal"]),
            this.actions.build(NPCActionType.IDLE, 10, [], ["goal"]),
            this.actions.build(NPCActionType.PICKUP_HEALTHPACK, 2, [], []),
            this.actions.build(NPCActionType.USE_HEALTHPACK, 1, [], ["goal"])
        ]);

        return goap;
    }
}


class NPCActionFactory {

    private player: GameNode;
    private battlers: BattleManager;
    private items: ItemManager;

    constructor(player: GameNode, battlers: BattleManager, items: ItemManager) {
        this.player = player;
        this.battlers = battlers;
        this.items = items;
    }

    build(type: NPCActionType, cost: number, pre: string[], eff: string[]): NPCAction<any> {
        switch(type) {
            case NPCActionType.GOTO_PLAYER: {
                return new GotoPlayer({player: this.player}, cost, pre, eff);
            }
            case NPCActionType.PICKUP_HEALTHPACK: {
                return new PickupHealthpack({items: this.items}, cost, pre, eff);
            }
            case NPCActionType.IDLE: {
                return new Guard(cost, pre, eff);
            }
            case NPCActionType.USE_HEALTHPACK: {
                return new UseHealthPack(cost, pre, eff);
            }
        }
    }
}

enum NPCActionType {
    GOTO_PLAYER = 0,
    PICKUP_HEALTHPACK = 1,
    USE_HEALTHPACK = 2,
    IDLE = 3
}