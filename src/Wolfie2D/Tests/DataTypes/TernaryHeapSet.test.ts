import TernaryHeapSet from "../../DataTypes/Collections/TernaryHeapSet";
/*
    A dummy compare function for heap construction.
    These tests use the compare function to assume that it's a min-heap.
*/
function compare(e1: number, e2: number) {
    return e1 - e2;
}

describe("TernaryTreeSet", () => {

    describe("constructor", () => {
        it("Should construct an empty heap", () => {
            let heap = new TernaryHeapSet(compare);
            expect(heap.size).toBe(0)
        });

        // NOTE: WILL BE ADAPTED TO HEAPIFY ARRAY 
        it("Should construct a heap given an valid array representing a heap", () => {
            let heap = new TernaryHeapSet(compare, [2, 3, 5, 4, 9, 6]);
            expect(heap.size).toBe(6)
            expect(heap.elements).toEqual([2, 3, 5, 4, 9, 6])
        });
    });

    describe("push(e: T): void;", () => {

        it("Should push to an empty heap", () => {
            let heap = new TernaryHeapSet(compare);
            heap.push(1);
            expect(heap.peek()).toBe(1);
        });
        
        it("Should push to a single-level heap", () => {
            let heap = new TernaryHeapSet(compare, [1]);
            heap.push(3);
            expect(heap.elements).toEqual([1, 3]);
        });

        it("Should push to a multi-level heap", () => {
            let heap = new TernaryHeapSet(compare, [1, 3, 5, 2, 9, 6, 4])
            heap.push(0);
            expect(heap.elements).toEqual([0, 3, 1, 2, 9, 6, 4, 5])
        });

        it("Should not be able to push to a heap that already contains the given element", () => {
            let heap = new TernaryHeapSet(compare, [1, 3, 5, 2, 9, 6, 4])
            expect(() => heap.push(5)).toThrowError();
        });

        /*
            Cases to consider:
                - More multi-element heaps (pushing int ascending/descending order, pushing an element that goes to the bottom of the heap, etc.)
        */
    });

    describe("pop(): T;", () => {
        
        it("Should pop from a single-level heap", () => {
            let heap = new TernaryHeapSet(compare, [1]);
            heap.pop();
            expect(heap.isEmpty()).toBeTruthy();
        });

        it("Should pop from a multi-level heap", () => {
            let heap = new TernaryHeapSet(compare, [1, 3, 5, 2, 9, 6, 4])
            heap.pop();
            expect(heap.elements.slice(0, heap.size)).toEqual([2, 3, 5, 4, 9, 6])
        });

        it("Should not be able to pop from an empty heap", () => {
            let heap = new TernaryHeapSet(compare)
            expect(() => heap.pop()).toThrowError();
        });
    });

    describe("restore(value: T): void;", () => {

        it("Should restore a value in a single-element heap", () => {
            let heap = new TernaryHeapSet(compare, [1])
            heap.restore(1)
            expect(heap.elements).toEqual([1]);
        });

        it("Should restore an intermediate node in a heap", () => {
            let heap = new TernaryHeapSet(compare, [1, 5, 12, 7, 9, 8, 6, 2, 10, 4])
            heap.restore(12);
            expect(heap.elements.slice(0, heap.size)).toEqual([1, 5, 2, 7, 9, 8, 6, 12, 10, 4]);
        });

        it("Should restore a leaf node in a heap", () => {
            let heap = new TernaryHeapSet(compare, [1, 5, 12, 7, 9, 8, 6, 2, 10, 4])
            heap.restore(2)
            expect(heap.elements).toEqual([1, 5, 2, 7, 9, 8, 6, 12, 10, 4]);
        });

        it("Should restore a root node in a multi-element heap", () => {
            let heap = new TernaryHeapSet(compare, [6, 5, 2, 7, 9, 8, 11, 12, 10, 4])
            heap.restore(6)
            expect(heap.elements).toEqual([2, 5, 4, 7, 9, 8, 11, 12, 10, 6]);
        });
    });
})