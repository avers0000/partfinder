import { CatalogMenuItem } from "./catalog-menu-item.model";

export class CatalogMenu {
    public items: CatalogMenuItem[];
    constructor(public name: string, public caption: string) {
        this.items = [];
    }
}