import ItemManager from "../../GameSystems/ItemSystem/ItemManager";
import Item from "../../GameSystems/ItemSystem/Items/Item";
import HealthPack from "../../GameSystems/ItemSystem/ItemTypes/HealthPack";
import NPCGoapAI from "../NPCGoapAI";
import NPCAction from "./NPCAction";

export default class PickupHealthpack extends NPCAction {

    protected items: ItemManager;
    protected item: Item | null;

    public constructor(cost: number, preconditions: string[], effects: string[], loopAction: boolean, items: ItemManager) {
        super(cost, preconditions, effects, loopAction);
        this.items = items;
        this.item = null;
    }

    public override performAction(statuses: string[], actor: NPCGoapAI, deltaT: number): string[] {
        // If the preconditions have been met, try to perform the action; otherwise return null (failure)
        if (this.checkPreconditions(statuses)) {

            // First, set the healthpack we want to move to
            if (this.item === null) {
                // Find the healthpack
                this.item = this.items.findItem((item: Item) => item.type.constructor === HealthPack && item.inv === null);
                // Start moving the actor towards the item
                actor.move(this.item.owner.position, 16);
            }

            // If the actor is at the items location, try to pickup the item; Otherwise loop until success or failure
            if (this.item.owner.position.distanceSqTo(actor.owner.position) < 16) {
                // Try to pickup the item
                let item: Item = this.item.pickup(actor.inventory);
                // If picking up the item fails, return null (failure)
                if (item === null) { 
                    return null;
                }
                // Otherwise, clear the item we're looking for and return effects (success)
                this.item = null;
                return this.effects
            } else {
                // Loop until
                return [];
            }
        }
        return null;
    }
  
    /**
     * Checks whether or not the NPCGoapAI can pickup an item or not. In addition to checking whether or not
     * the statuses have been met, there must be a healthpack item available that is not in an inventory.
     * @param statuses the statuses of the NPCGoapAI
     * @returns true if the preconditions have been met; false otherwise.
     */
    public override checkPreconditions(statuses: string[]): boolean {
        return this.preconditions.every(status => statuses.includes(status)) && this.items.findItem((item: Item) => item.type.constructor === HealthPack && item.inv === null) !== undefined;
    }
}