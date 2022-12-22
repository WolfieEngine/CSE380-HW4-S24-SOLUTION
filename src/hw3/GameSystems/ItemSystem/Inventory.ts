import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import { ItemEvent } from "../../Events";
import Item from "./Items/Item";

/**
 * An inventory is a collection of items. All items in the inventory must be registered with
 * the Inventorys ItemManager class. 
 */
export default class Inventory {

    /** The GameNode that owns this inventory */
    protected _owner: GameNode;

    /** A flag indicating whether the */
    protected _dirty: boolean;

    /** The maximum number of items this inventory can hold */
    protected _cap: number;

    /** The number of items in this inventory */
    protected _size: number;

    /** The collection of items in the inventory */
    protected inv: Map<number, Item>;

    public constructor(owner: GameNode, items: Array<Item> = [], cap: number = 9) {
        this._owner = owner;
        this._size = 0;
        this._cap = cap;
        this.inv = new Map<number, Item>();
        items.forEach(item => item.pickup(this));
    }

    public get owner(): GameNode { return this._owner; }
    public get dirty(): boolean { return this._dirty; }
    protected set dirty(dirty: boolean) { this._dirty = dirty; }

    /**
     * Gets an item from this inventory by id.
     * @param id the id of the item to get
     * @returns the item if it exists; null otherwise
     */
    get(id: number): Item | null {
        if (!this.has(id)) {
            return null;
        }
        return this.inv.get(id);
    }

    /**
     * Adds an item to this inventory
     * @param item adds an item to the inventory with the key of the items owner
     * @returns if the Item was successfully added to the inventory; null otherwise
     */
    add(item: Item): Item | null { 
        if (this.has(item.owner.id) || this._size >= this._cap) {
            return null;
        }
        console.log("Inventory.add", `Adding item with id ${item.owner.id} to inventory with owner id ${this.owner.id}`);
        this.inv.set(item.owner.id, item);
        this._size += 1;
        this.dirty = true;
        return item;
    }

    /**
     * Checks if an item with the given id number exists in this inventory.
     * @param id the id of the item in the inventory
     * @returns true if the item with the id exists; false otherwise
     */
    has(id: number): boolean { 
        return this.inv.has(id);
    }

    /**
     * Removes the item with the given id number from this inventory
     * @param id the id of the item
     * @returns the item that was removed or null 
     */
    remove(id: number): Item | null { 
        if (!this.has(id)) {
            return null;
        }
        let item: Item = this.get(id);
        this.inv.delete(id);
        this._size -= 1;
        this.dirty = true
        return item;
    }

    /**
     * Finds the first item in this inventory that meets the given condition.
     * @param pred the predicate function (the condition)
     * @returns 
     */
    find(pred: (item: Item) => boolean): Item | null {
       let item: Item = Array.from(this.inv.values()).find(pred);
       return item === undefined ? null : item;
    }

    /**
     * Finds and returns all Items in the Inventory that meet the given condition
     * @param pred the predicate function
     * @returns a list of Items
     */
    findAll(pred: (item: Item) => boolean): Item[] | [] {
        return Array.from(this.inv.values()).filter(pred);
    }
    /**
     * Applies the given function to each item in the Inventory
     * @param func the function
     */
    forEach(func: (item: Item) => void): void {
        for (let item of this.inv.values()) {
            func(item);
        }
    }

    public clean(): void {
        this._dirty = false;
        if (this.owner.aiActive) {
            this.owner._ai.handleEvent(new GameEvent(ItemEvent.INVENTORY_CHANGED, {id: this.owner.id, inv: Array.from(this.inv.values())}));
        }
    }
}