import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

export default class Healthbar implements Updateable {

    protected scene: Scene;
    protected layer: string;
    protected owner: CanvasNode;

    protected healthBar: Label;
    protected healthBarBg: Label;

    protected curhp: number;
    protected maxhp: number;

    constructor(scene: Scene, layer: string, owner: CanvasNode) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;

        this.curhp = 1;
        this.maxhp = 1;

        this.healthBar = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone(), text: ""});
        this.healthBar.backgroundColor = Color.RED;

        this.healthBarBg = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone(), text: ""});
        this.healthBarBg.backgroundColor = Color.TRANSPARENT;
        this.healthBarBg.borderColor = Color.BLACK;
        this.healthBarBg.borderWidth = 1;
    }

    update(deltaT: number): void {
        this.healthBar.size.copy(this.owner.sizeWithZoom);
        this.healthBar.size.y /= 5;
        this.healthBarBg.size.copy(this.owner.sizeWithZoom);
        this.healthBarBg.size.y /= 5;

        this.healthBar.position.copy(this.owner.position);
        this.healthBar.position.y -= this.owner.size.y / 2 + this.healthBar.size.y / 2;
        this.healthBarBg.position.copy(this.owner.position);
        this.healthBarBg.position.y -= this.owner.size.y / 2 + this.healthBarBg.size.y / 2;

        let unit = this.healthBarBg.size.x / this.maxhp;
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (this.maxhp - this.curhp), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2) * (this.maxhp - this.curhp), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = this.curhp < this.maxhp * 1/4 ? Color.RED: this.curhp < this.maxhp * 3/4 ? Color.YELLOW : Color.GREEN;
       
    }

    public updateHealthBar(curhp: number, maxhp: number): void {
        console.log(`Health change event caught! Curhp: ${curhp} Maxhp: ${maxhp}`);
        this.curhp = curhp;
        this.maxhp = maxhp;
    }

}