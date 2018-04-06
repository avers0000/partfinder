export class Pageable<T> {
    public data: T[];
    public total;

    constructor() {
        this.data = [],
        this.total = 0
    }
}