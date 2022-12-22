import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import LaserGun from "../../../../GameSystems/ItemSystem/ItemTypes/LaserGun";
import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import NPCGoapAI from "../../NPCGoapAI";
import UseItemAction from "./UseItemAction";
import Timer from "../../../../../Wolfie2D/Timing/Timer";

export default class UseLaserGun extends UseItemAction {

    protected cooldown: Timer;

    constructor(cost?: number, preconditions?: string[], effects?: string[]) {
        super(cost, preconditions, effects)
        this.cooldown = new Timer(5000);
    }

    getItem(npc: NPCGoapAI): Item | null {
        return npc.inventory.find((item: Item) => item.type.constructor === LaserGun);
    }

    useItem(npc: NPCGoapAI): GoapActionStatus {
        if (!npc.isTargetVisible(npc.target.position)) return GoapActionStatus.FAILURE;

        if (!this.cooldown.isStopped()) return GoapActionStatus.RUNNING;

        this.item.use(npc.owner, npc.owner.position.dirTo(npc.target.position));
        this.cooldown.start();

        return GoapActionStatus.SUCCESS;
    }

    checkPreconditions(npc: NPCGoapAI, status: string[]): boolean {
        return super.checkPreconditions(npc, status);
    }

}
