import { CatalogMenuItem } from "./catalog-menu-item.model";

export class CatalogState {
    constructor(
        public manufacturer: CatalogMenuItem, 
        public model: CatalogMenuItem, 
        public category: CatalogMenuItem, 
        public group: CatalogMenuItem, 
        public searchBy: string = 'model', 
        public searchText: string = '',
        public productId: number = null,
        public page?: number
    ) {
        if (!page) this.page = 1;
    }


    
}