import { GoapActionStatus } from "../../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import Item from "../../../../GameSystems/ItemSystem/Items/Item";
import NPCGoapAI from "../../NPCGoapAI";
import NPCAction from "../NPCAction";

export default abstract class PickupHealthpack extends NPCAction {

    protected item: Item | null;

    performAction(npc: NPCGoapAI): GoapActionStatus {
        if (this.item === null) { 
            return GoapActionStatus.FAILURE; 
        }
        return this.item.pickup(npc.inventory) !== null ? GoapActionStatus.SUCCESS : GoapActionStatus.FAILURE;
    }

    update(npc: NPCGoapAI): void {
        
    }

    abstract getItem(npc: NPCGoapAI): Item;

    reset(npc: NPCGoapAI): void {
        this.item = this.getItem(npc);
    }
    
    checkPreconditions(npc: NPCGoapAI, status: string[]): boolean {
        return super.checkPreconditions(npc, status);
    }
}