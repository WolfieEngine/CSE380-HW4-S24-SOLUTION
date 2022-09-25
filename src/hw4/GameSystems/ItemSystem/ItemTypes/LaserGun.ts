import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Layer from "../../../../Wolfie2D/Scene/Layer";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import WeaponType from "./WeaponType";

export default class LaserGun implements WeaponType {
    
    protected _scene: Scene;
    protected _line: Line;
    protected _name: string;
    protected _damage: number;

    public constructor(scene: Scene, name: string, damage: number) {
        this.scene = scene;
        this.name = name;
        this.damage = damage;
    }

    public get name(): string { return this._name; }
    public get damage(): number { return this._damage; }
    public get scene(): Scene { return this._scene; }
    public get line(): Line { return this._line; }
    protected set name(name: string) { this._name = name; }
    protected set damage(damage: number) { this._damage = damage; }
    protected set scene(scene: Scene) { this._scene = scene; }
    protected set line(line: Line) { this._line = line; }
    
    public init(): void {
        let line = <Line>this.scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line.color = Color.GREEN;

        line.tweens.add("fade", {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: "Laser faded"
        });

        this.line = line;
    }

    public hits(user: GameNode, dir: Vec2): GameNode[] {
        this.setLine(user, dir);
        let layer: Layer = user.getLayer();
        let nodes: GameNode[] = new Array<GameNode>();
        for (let node of layer.getItems()) {
            if (node.collisionShape !== undefined && node.collisionShape.getBoundingRect().intersectSegment(this.line.start, this.line.end.clone().sub(this.line.start)) !== null) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    public animate(user: GameNode, dir: Vec2): void {
        this.line.tweens.play("fade");
    }

    protected setLine(user: GameNode, dir: Vec2): void {
        let start = user.position.clone();
        let end = user.position.clone().add(dir.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>user.getScene().getLayer("Wall").getItems()[0];

        let minIndex = walls.getTilemapPosition(minX, minY);
		let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                        console.log("Found hit");
                        end = hit.pos;
                    }
                }
            }
        }

        this.line.start = start;
        this.line.end = end;
    }
    
}