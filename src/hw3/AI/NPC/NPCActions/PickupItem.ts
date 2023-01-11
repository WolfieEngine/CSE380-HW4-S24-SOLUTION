import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCActor from "../NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Item from "../../../GameSystems/ItemSystem/Item";

export default class PickupTargetedItem extends NPCAction {

    // The item we're trying to pickup
    protected item: Item | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.item = null;
    }

    public onEnter(options: Record<string, any>): void {
        console.log("Started pickup item action!");

        // The item to pickup should be the NPCs current target
        if (this.actor.hasTarget()) {
            let target = this.actor.getTarget();
            // If the NPCs target is an item - set this.item = target
            if (target !== null && target instanceof Item) {
                console.log("Picking up an item!!!");
                this.item = target;
            }
        }
    }

    public handleInput(event: GameEvent): void {

    }

    public update(deltaT: number): void {
        // If the item is not null and the item is not already in an inventory, add the item to the actors inventory
        if (this.item !== null && this.item.inventory === null) {
            this.actor.inventory.add(this.item);
        }
        // Finish the action
        this.finished();
    }

    public onExit(): Record<string, any> {
        // Clear the reference to the item
        this.item = null;
        return {};
    }



}