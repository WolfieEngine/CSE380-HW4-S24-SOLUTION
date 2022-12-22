export default interface ItemType {

    get name(): string;

    init(...args: any): void;
}