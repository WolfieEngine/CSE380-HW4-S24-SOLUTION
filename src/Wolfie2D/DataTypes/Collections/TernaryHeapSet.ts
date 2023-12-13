import Collection from "../Interfaces/Collection";

export default class TernaryHeapSet<T> implements Collection {

    private readonly ROOT: number;

    /** An array representing the binary heap backing the priority queue */
    private _elements: Array<T>;
    /** A mapping of nodes that exist in the queue to their positions in the heap array */
    private map: Map<T, number>;

    /** The number of elements currently in the heap */
    private _size: number;
    /** The comparison function used to compare heap elements */
    private comp: (e1: T, e2: T) => number;

    constructor(compareTo: (e1: T, e2: T) => number, elements: Array<T> = new Array<T>()) {
        this.ROOT = 0;
        this._elements = elements;
        let key = 0;
        this.map = new Map<T, number>(elements.map(e => [e, key++]));
        this._size = elements.length;
        this.comp = compareTo;
    }

    public get elements() {
        return this._elements;
    }

    public get size() {
        return this._size;
    }

    push(e: T): void {
        if(this.map.has(e))
            throw new Error(`Duplicate value: ${e} already exists in the heap.`);
        this.elements[this.size] = e;
        this.map.set(e, this.size);
        this.percup(this.size);
        this._size += 1;
    }

    pop(): T {
        if(this.isEmpty())
            throw new RangeError('Popping from an empty heap')
        let top = this.peek();
        this.map.delete(this.elements[this.ROOT]);
        this._size -= 1;

        this.elements[this.ROOT] = this.elements[this.size];
        this.map.delete(this.elements[this.size]);
        this.percdown(this.ROOT);

        return top;
    }

    peek(): T {
        return this.elements[this.ROOT];
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(func: Function): void {
        this.elements.forEach(func());
    }

    clear(): void {
        this.elements.fill(null);
    }

    restore(value: T): void {
        let node = this.map.get(value);
        this.percup(node);
        this.percdown(node);
    }

    has(value: T): boolean {
        return this.map.has(value);
    }

    toString(): string {
        let res = "Backing Heap: [";
        for (let i = 0; i < this.size; i++) {
            res += `${this.elements[i]}`
            if (i < this.size - 1) {
                res += ", "
            }
        }
        res += "]\nMap: [\n";
        this.map.forEach((val: number, key: T) => {
            res += `\t${key} -> ${val}\n`;
        });
        res += "]";
        return res;
    }

    percup(node: number): void {
        let prnt = this.parent(node);
        while (node > this.ROOT && this.comp(this.elements[node], this.elements[prnt]) < 0) {
            this.swap(node, prnt);
            node = prnt;
            prnt = this.parent(node);
        }
    }
    percdown(node: number): void {
        let child = this.lchild(node);
        while (child < this.size) {
            if (child < this.size - 1 && this.comp(this.elements[child], this.elements[child + 1]) > 0) {
                child += 1;
                if(child < this.size - 1 && this.comp(this.elements[child], this.elements[child + 1]) > 0)
                    child += 1;
            }
            else if(child < this.size - 2 && this.comp(this.elements[child], this.elements[child + 2]) > 0)
                child += 2;
            
            if (this.comp(this.elements[child], this.elements[node]) < 0) {
                this.swap(node, child);
                node = child;
                child = this.lchild(node);
            } else {
                break;
            }
        }
    }

    parent(node: number): number { 
        return Math.floor((node - 1)/3);
    }
    protected lchild(node: number): number { 
        return node*3 + 1; 
    }
    protected mchild(node: number): number { 
        return node*3 + 2; 
    }
    protected rchild(node: number): number { 
        return node*3 + 3; 
    }
    protected swap(node1: number, node2: number): void {
        this.map.set(this.elements[node1], node2);
        this.map.set(this.elements[node2], node1);

        let temp = this.elements[node1];
        this.elements[node1] = this.elements[node2];
        this.elements[node2] = temp;
    }
}