import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import ConsumableType from "./ConsumableType";

export default class HealthPack implements ConsumableType {

    protected _scene: Scene;
    protected _name: string;
    protected _health: number;

    public constructor(scene: Scene, name: string, health: number) {
        this.scene = scene;
        this.name = name; 
        this.health = health;
    }

    public animate(consumer: GameNode): void {}

    public init(...args: any): void {}

    public get scene(): Scene { return this._scene; }
    public get name(): string { return this._name; }
    public get health(): number { return this._health; }
    public get effects(): Record<string, any> { return {health: this.health} }

    protected set scene(scene: Scene) { this._scene = scene; }
    protected set name(name: string) { this._name = name; }
    protected set health(health: number) { this._health = health; }

}