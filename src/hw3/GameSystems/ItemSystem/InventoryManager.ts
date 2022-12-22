import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Inventory from "./Inventory";
import Item from "./Items/Item";

/**
 * A class for managing a set of Inventory objects in an ItemManager
 */
export default class InventoryManager implements Updateable {

    /** A mapping of unique ids to Inventory objects */
    protected inventories: Map<number, Inventory>;

    public constructor() { 
        this.inventories = new Map<number, Inventory>(); 
    }

    /**
     * Updates this InventoryManager and all inventories in the InventoryManager if they have changed
     * since the last frame.
     * @param deltaT 
     */
    public update(deltaT: number): void {
        this.inventories.forEach((inv: Inventory) => {
            if (inv.dirty) inv.clean();
        });
    }

    /**
     * Gets the inventory associated with the GameNode with the given id if it exists
     * @param id the id of the GameNode
     * @returns the inventory associated with the given id or null
     */
    public get(id: number): Inventory | null {
        if (!this.has(id)) {
            return null
        }
        return this.inventories.get(id);
    }

    /**
     * Checks if the GameNode with the given id has an inventory in this InventoryManager.
     * @param id the id of the inventory
     * @returns true if the GameNode has an inventory in this InventoryManager; false otherwise
     */
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

    /**
     * Unregisters a GameNode from an inventory of items in this InventoryManager.
     * @param id the id of the GameNode
     * @returns the inventory of the GameNode or null
     */
    public unregister(id: number): Inventory | null {
        let inv: Inventory | null = this.inventories.get(id);
        if (inv === null) return null;
        inv.forEach((item: Item) => item.drop(inv.owner.position, inv.owner.getLayer()));
        return this.inventories.delete(id) ? inv : null;
    }

}