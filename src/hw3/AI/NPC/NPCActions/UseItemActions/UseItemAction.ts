import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

/**
 * Another abstract NPCAction for using an item.
 */
export default abstract class UseItemAction extends NPCAction {

    protected item: Item | null = null;

    performAction(npc: NPCGoapAI): GoapActionStatus {
        if (this.item === null || !npc.inventory.has(this.item.owner.id)) {
            return GoapActionStatus.FAILURE;
        }
        return this.useItem(npc);
    }
    reset(ai: NPCGoapAI): void {
        this.item = this.getItem(ai);
    }
    update(ai: NPCGoapAI): void { }

    abstract getItem(npc: NPCGoapAI): Item | null;

    abstract useItem(npc: NPCGoapAI): GoapActionStatus;

    checkPreconditions(npc: NPCGoapAI, status: string[]): boolean {
        return super.checkPreconditions(npc, status);
    }
    
}