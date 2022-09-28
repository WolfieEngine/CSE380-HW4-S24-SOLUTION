import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Item from "./Item";
import WeaponType from "../ItemTypes/WeaponType";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { ItemEvent } from "../../../Events";
import { Debugger } from "../../../Debugger";

export default class Weapon extends Item {
    
    protected _type: WeaponType;
    protected emitter: Emitter;
    
    constructor(owner: Sprite, type: WeaponType){
        super(owner, type);
        this.type = type;
        this.emitter = new Emitter();
        this.type.init();
    }

    public override use(user: GameNode, dir: Vec2): void {
        Debugger.print("item", `Using weapon type ${this.type.constructor}! User id: ${user.id} Direction: ${dir}`);
        let hits: Array<GameNode> = this.type.hits(user, dir);
        this.type.animate(user, dir);
        this.emitter.fireEvent(ItemEvent.WEAPON_USED, {userId: user.id, item: this, type: this.type, hits: hits});
    }

    public override get type(): WeaponType { return this._type; }
    protected override set type(type: WeaponType) { this._type = type; }
}