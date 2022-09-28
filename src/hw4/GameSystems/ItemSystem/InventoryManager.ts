import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Inventory from "./Inventory";
import Item from "./Items/Item";

export default class InventoryManager {

    protected inventories: Map<number, Inventory>;
    protected receiver: Receiver;

    public constructor() { 
        this.inventories = new Map<number, Inventory>(); 
    }

    public update(deltaT: number): void {
        this.inventories.forEach((inv: Inventory) => {
            if (inv.dirty) inv.clean();
        });
    }

    public get(id: number): Inventory | null {
        if (!this.has(id)) {
            return null
        }
        return this.inventories.get(id);
    }
    public has(id: number): boolean {
        return this.inventories.has(id);
    }

    /**
     * Registers a GameNode with an inventory of items with this InventoryManager. 
     * @param owner the GameNode that owns the inventory
     * @param items any items that should initially be added to the inventory
     * @returns the new inventory object; null if an error occurs
     */
    public register(owner: GameNode, items: Array<Item> = [], cap: number = 9): Inventory | null {
        if (this.has(owner.id)) {
            return null;
        }
        let inv: Inventory = new Inventory(owner, items);
        this.inventories.set(owner.id, inv);
        return inv;
    }


}