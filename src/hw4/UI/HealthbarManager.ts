import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Scene from "../../Wolfie2D/Scene/Scene";
import Healthbar from "./Healthbar";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import { HudEvent } from "../Events";

/**
 * A manager class for managing healthbars in the UI
 */
export default class HealthbarManager implements Updateable {

    /** The scene and layers where the healthbars managed by this HealthbarManager are located */
    protected scene: Scene;
    protected layer: string;

    /** A map of GameNode owner ids to their healthbars in this healthbar manager */
    protected healthbars: Map<number, Healthbar>

    /** A receiver for receiving health-change events */
    protected receiver: Receiver;

    public constructor(scene: Scene, layer: string) {
        this.scene = scene;
        this.layer = layer;
        this.healthbars = new Map<number, Healthbar>();

        this.receiver = new Receiver();
        this.receiver.subscribe(HudEvent.HEALTH_CHANGE);
    }

    public update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        for (let hbar of this.healthbars.keys()) {
            this.healthbars.get(hbar).update(deltaT);
        }

    }

    /**
     * Registers a GameNode with a new healthbar if it doesn't already have one.
     * @param node the node to register to a new healthbar
     * @param size the size of the healthbar
     * @returns the Healthbar component or null if the GameNode already has a healthbar
     */
    public register(node: CanvasNode, size: Vec2): Healthbar | null {
        let hbar: Healthbar = new Healthbar(this.scene, this.layer, new Vec2(32, 8), new Vec2(0, -16), node);
        if (this.healthbars.has(node.id)) {
            return null;
        }
        this.healthbars.set(node.id, hbar);
        return hbar;
    }
    /**
     * Unregisters a GameNode from it's healthbar 
     * @param id the id of the GameNode
     * @returns the GameNodes healthbar components or null 
     */
    public unregister(id: number): Healthbar | null { 
        if (this.healthbars.has(id)) {
            let hbar: Healthbar = this.healthbars.get(id);
            this.healthbars.delete(id);
            return hbar;
        }
        return null;
    }
    /**
     * Destroys this HealthbarManager and all of it's Healthbars
     */
    public destroy(): void {
        this.receiver.destroy();
        this.healthbars.forEach((healthbar) => healthbar.destroy());
    }
    /**
     * A reducer function for handling health change events
     * @param event a game event
     */
    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case HudEvent.HEALTH_CHANGE: {
                this.handleHealthChangeEvent(event);
                break;
            }
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in HealthbarManager.`);
            }
        }
    }
    /**
     * Handles a health change by updating a healthbar
     * @param event a health-change event
     */
    protected handleHealthChangeEvent(event: GameEvent): void {
        let id = event.data.get("id");

        if (this.healthbars.has(id)) {
            this.healthbars.get(id).updateHealthBar(event.data.get("curhp"), event.data.get("maxhp"));
        }
    }

}