import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

/**
 * A UI component that's suppossed to represent a healthbar
 */
export default class Healthbar implements Updateable {

    /** The scene and layer in the scene the healthbar is in */
    protected scene: Scene;
    protected layer: string;

    /** The GameNode that owns this healthbar */
    protected owner: GameNode;

    /** The size and offset of the healthbar from it's owner's position */
    protected size: Vec2;
    protected offset: Vec2;

    /** The actual healthbar (the part with color) */
    protected healthBar: Label;
    /** The healthbars background (the part with the border) */
    protected healthBarBg: Label;

    /** The current health of the owner */
    protected curhp: number;
    /** The maximum health of the owner */
    protected maxhp: number;

    public constructor(scene: Scene, layer: string, size: Vec2, offset: Vec2, owner: GameNode) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;

        this.size = size;
        this.offset = offset;

        this.curhp = 1;
        this.maxhp = 1;

        this.healthBar = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone().add(this.offset), text: ""});
        this.healthBar.size.copy(size);
        this.healthBar.backgroundColor = Color.RED;

        this.healthBarBg = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone().add(this.offset), text: ""});
        this.healthBarBg.backgroundColor = Color.TRANSPARENT;
        this.healthBarBg.borderColor = Color.BLACK;
        this.healthBarBg.borderWidth = 1;
        this.healthBarBg.size.copy(size);
    }

    /**
     * Updates the healthbars position according to the position of it's owner
     * @param deltaT 
     */
    public update(deltaT: number): void {
        
        this.healthBar.position.copy(this.owner.position).add(this.offset);
        this.healthBarBg.position.copy(this.owner.position).add(this.offset);

        let scale = this.scene.getViewScale();
        this.healthBar.scale.scale(scale);
        this.healthBarBg.scale.scale(scale);

        let unit = this.healthBarBg.size.x / this.maxhp;
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (this.maxhp - this.curhp), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / scale / 2) * (this.maxhp - this.curhp), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = this.curhp < this.maxhp * 1/4 ? Color.RED : this.curhp < this.maxhp * 3/4 ? Color.YELLOW : Color.GREEN;
    }

    /**
     * When the owner's health changes, this methods gets called by the healthbars mananger 
     * to update the current and maximum health values.
     * @param curhp 
     * @param maxhp 
     */
    public updateHealthBar(curhp: number, maxhp: number): void {
        if (curhp !== this.curhp || maxhp !== this.maxhp) {
            this.curhp = curhp;
            this.maxhp = maxhp;
        }
    }

    /**
     * Destroys the healthbar and all of it's assets
     */
    public destroy(): void {
        this.healthBar.destroy();
        this.healthBarBg.destroy();
        this.size = null;
        this.offset = null;
        this.scene = null;
        this.owner = null;
    }

}