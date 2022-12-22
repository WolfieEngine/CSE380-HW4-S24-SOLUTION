import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../../Wolfie2D/Scene/Layer";
import Inventory from "../Inventory";
import ItemType from "../ItemTypes/ItemType";


export default abstract class Item {
    /** The sprite that represents this weapon in the world */
    protected _owner: Sprite;
    /** The inventory that this item is in */
    protected _inv: Inventory | null;
    /** The type of the item */
    protected _type: ItemType;

    protected emitter: Emitter;

    public constructor(owner: Sprite, type: ItemType){ 
        this.owner = owner; 
        this.type = type;
        this.inv = null;
        this.emitter = new Emitter();
    }

    /**
     * Adds an item to the given inventory
     * @param inv the inventory to add the item to
     * @returns the item if it was added to the inventory; null otherwise
     */
    public pickup(inv: Inventory): Item | null {
        if (this.inv !== null) {
            return null;
        }
        this.inv = inv;
        this.owner.position.copy(Vec2.ZERO_STATIC);
        this.owner.visible = false;
        return this.inv.add(this);
    }
    /**
     * Drops the item at the given position in the given layer
     * @param position the position to drop the item at
     * @param layer the layer to drop the item in
     * @returns the item that was dropped; null if something went wrong
     */
    public drop(position: Vec2, layer: Layer): Item | null { 
        if (this.inv === null) {
            return null;
        }
        let res: Item | null = this.inv.remove(this.owner.id);
        if (res === null) { 
            return null;
        }
        this.inv = null;
        layer.addNode(this.owner);
        this.owner.position.copy(position);
        this.owner.visible = true;
        return this;
    }

    /**
     * Moves an item from it's current inventory to another inventory
     * @param des the destination inventory to move the item to
     * @returns the item that was moved; null if something went wrong
     */
    public move(des: Inventory): Item | null {
        if (this.inv === null) {
            return null
        }
        if (this.inv.remove(this.owner.id) || des.add(this)) { return null; }
        this.inv = des;
        return this;
    }

    public get owner(): Sprite { return this._owner; }
    protected set owner(owner: Sprite) { this._owner = owner; }
    public get inv(): Inventory { return this._inv; }
    protected set inv(inv: Inventory) { this._inv = inv; }
    public get type(): ItemType { return this._type; }
    protected set type(type: ItemType) { this._type = type; }

    public abstract use(...args: any): void;
}