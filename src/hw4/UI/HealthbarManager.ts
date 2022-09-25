import Map from "../../Wolfie2D/DataTypes/Collections/Map";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Scene from "../../Wolfie2D/Scene/Scene";
import Healthbar from "./Healthbar";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";

export default class HealthbarManager implements Updateable {

    protected scene: Scene;
    protected layer: string;
    protected healthbars: Map<Healthbar>

    protected receiver: Receiver;

    public constructor(scene: Scene, layer: string) {
        this.scene = scene;
        this.layer = layer;
        this.healthbars = new Map<Healthbar>();

        this.receiver = new Receiver();
        
    }

    public update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        for (let hbar of this.healthbars.keys()) {
            this.healthbars.get(hbar).update(deltaT);
        }

    }
    public addHealthbar(node: CanvasNode, size: Vec2) {
        this.healthbars.add(node.id.toString(), new Healthbar(this.scene, this.layer, node));
    }
    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in HealthbarManager.`);
            }
        }
    }
    protected handleHealthChangeEvent(event: GameEvent): void {
        let id = event.data.get("id");
        if (this.healthbars.has(id)) {
            this.healthbars.get(id).updateHealthBar(event.data.get("curhp"), event.data.get("maxhp"));
        }
    }

}