import { CatalogMenuItem } from "../catalog/catalog-menu-item.model";

export class Product {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public description: string,
        public manufacturer: CatalogMenuItem,
        public model: CatalogMenuItem,
        public modification: string,
        public category: CatalogMenuItem,
        public group: CatalogMenuItem,
        public price: number,
        public photos: string[]
    ){};
}