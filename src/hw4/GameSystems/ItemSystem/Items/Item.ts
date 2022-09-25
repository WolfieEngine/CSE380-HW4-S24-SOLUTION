import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../../Wolfie2D/Scene/Layer";
import { Debugger } from "../../../Debugger";
import Inventory from "../Inventory";
import ItemType from "../ItemTypes/ItemType";

export default abstract class Item {
    /** The sprite that represents this weapon in the world */
    protected _owner: Sprite;
    /** The inventory that this item is in */
    protected _inv: Inventory | null;
    /** The type of the item */
    protected _type: ItemType;

    public constructor(owner: Sprite, type: ItemType){ 
        this.owner = owner; 
        this.type = type;
        this.inv = null;
    }

    public pickup(inv: Inventory): Item | null {
        Debugger.print("item", `Picking up an item! Item sprite id: ${this.owner.id} Inventory owner id: ${inv.owner.id}`);
        if (this.inv !== null) {
            return null;
        }
        this.inv = inv;
        this.owner.position.copy(Vec2.ZERO_STATIC);
        this.owner.visible = false;
        return this.inv.add(this);
    }

    public drop(position: Vec2, layer: Layer): Item | null { 
        Debugger.print("item", `Dropping an item! Item sprite id: ${this.owner.id} Position: ${position} Layer ${layer}`)
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

    public move(des: Inventory): Item | null {
        console.log(`Moving an item with name ${this.type.name}`);
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