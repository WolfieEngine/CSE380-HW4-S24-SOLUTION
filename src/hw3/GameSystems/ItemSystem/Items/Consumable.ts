import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import { ItemEvent } from "../../../Events";
import ConsumableType from "../ItemTypes/ConsumableType";
import Item from "./Item";

export default class Consumable extends Item {

    protected _type: ConsumableType;

    public constructor(owner: Sprite, type: ConsumableType) {
        super(owner, type);
    }

    public use(consumer: GameNode): void {
        this._type.animate(consumer);
        this.emitter.fireEvent(ItemEvent.CONSUMABLE_USED, {consumerId: consumer.id, item: this, type: this.type, effects: this.type.effects});
        this._inv.remove(this.owner.id);
    }

    public override get type(): ConsumableType { return this._type; }
    protected override set type(type: ConsumableType) { this._type = type; }

    
}