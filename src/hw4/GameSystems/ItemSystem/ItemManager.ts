import Battler from "../BattleSystem/Battlers/Battler"
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Item from "./Items/Item";
import Inventory from "./Inventory";
import InventoryManager from "./InventoryManager";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import ItemType from "./ItemTypes/ItemType";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default class ItemManager implements Updateable {

    protected receiver: Receiver;
    protected items: Map<number, Item>;
    protected inventoryManager: InventoryManager;

    public constructor() {
        this.items = new Map<number, Item>();
        this.inventoryManager = new InventoryManager();
        this.receiver = new Receiver();
        this.receiver.subscribe(["pickup", "drop"]) // id of node picking up
    }

    public update(delta: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.inventoryManager.update(delta);
    }

    public handleEvent(event: GameEvent): void { 
        switch(event.type) {
            case "pickup": {
                console.log("Caught pickup event in ItemManager");
                this.handlePickup(event);
                break;
            }
            case "drop": {
                console.log("Caught drop event in ItemManager");
                this.handleDrop(event);
                break;
            }
        }
    }

    /** Registers an item in this ItemManager */
    public registerItem(constr: new (owner: Sprite, type: ItemType) => Item, owner: Sprite, type: ItemType): Item | null {
        if (this.items.has(owner.id)) {
            return null;
        }
        this.items.set(owner.id, new constr(owner, type));
    }

    /** Registers an inventory in the ItemManager */
    public registerInventory(owner: GameNode, items?: Array<Item>, cap?: number): Inventory | null {
        // items.forEach(item => this.registerItem(item));
        return this.inventoryManager.register(owner, items);
    }
    
    public getItem(id: number): Item | null { return this.items.get(id); }

    public hasItem(id: number): boolean { return this.items.has(id); }

    public getInventory(id: number): Inventory | null { return this.inventoryManager.get(id); }

    public hasInventory(id: number): boolean { return this.inventoryManager.has(id); }

    public findItem(pred: (item: Item) => boolean): Item | null {
        let item = Array.from(this.items.values()).find(pred);
        return item === undefined ? null : item;
    }

    public handlePickup(event: GameEvent): void { 
        let ownerId = event.data.get("id");
        let inventory: Inventory | null = this.getInventory(ownerId);
        if (inventory === null) return console.warn(`No inventory found for owner with id ${ownerId}`);

        let item: Item | null = this.findItem((item: Item) => item.owner.position.distanceSqTo(inventory.owner.position) < 16 )
        if (item === null) return console.log(`No items found in pickup range of inventory owners position`);

        item.pickup(inventory);
        console.log(inventory);
    }

    public handleDrop(event: GameEvent): void {
        let ownerId = event.data.get("id");
        let inventory: Inventory | null = this.getInventory(ownerId);
        if (inventory === null) return console.warn(`No inventory found for owner with id ${ownerId}`);

        let item: Item | null = inventory.find((item: Item) => true);
        if (item === null) return console.log(`Owner with id ${ownerId} does not have any items they can drop`);

        item.drop(inventory.owner.position, inventory.owner.getLayer());
        console.log(inventory);
    }
}