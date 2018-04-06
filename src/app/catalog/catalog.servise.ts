import { Injectable } from "@angular/core";
import { UrlSegment } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { CatalogState } from "./catalog-state.model";
import { CatalogMenuItem } from "./catalog-menu-item.model";
import { CatalogMenu } from "./catalog-menu.model";
import { Product } from "../shared/product.model";
import { Pageable } from "../shared/pageable.model";
import { CatalogConfig } from "./catalog-config.model";

@Injectable()
export class CatalogService {
    catalogStateChanged: Subject<CatalogState>;
    private catalogConfig: CatalogConfig;
    private catalogState: CatalogState;
    private url: string = 'https://partfinder-8bf92.firebaseio.com/';

    private menus: CatalogMenu[] = [
        new CatalogMenu('manufacturer', 'выбор по производителю'),
        new CatalogMenu('model', 'выбор по модели'),
        new CatalogMenu('category', 'категории запчастей'),
        new CatalogMenu('group', 'Детали'),
    ];
   
    constructor(private http: HttpClient) {
        this.catalogConfig = new CatalogConfig();
        this.catalogState = new CatalogState(null, null, null, null);
        this.catalogStateChanged = new Subject<CatalogState>();
    }

    getCatalogConfig(): CatalogConfig {
        return this.catalogConfig;
    }

    //------------------- CatalogState ---------------------

    clearCatalogState(): void {
        this.catalogState = new CatalogState(null, null, null, null);
        this.catalogStateChanged.next(this.catalogState);
    }

    setCatalogState(catalogState) : void {
        this.catalogState = catalogState;
        this.catalogStateChanged.next(this.catalogState);
    }

    getCatalogState() : CatalogState {
        return this.catalogState;
    }

    catalogStateHasValues() : boolean {
        return this.catalogState.manufacturer != null || this.catalogState.model != null || this.catalogState.category != null || this.catalogState.group != null;
    }

    parseCatalogStateFromRouteAsync(url: UrlSegment[], search: string = '', page?: number): void {
        let manufacturerName: string;
        let modelName: string;
        let categoryName: string;
        let groupName: string;
        let searchBy: string = 'model';
        let productId: number = null;

        if (url && url.length > 0 && url[0].path === 'catalog') {
            if (url.length > 1) {
                if (url[1].path === 'category') {
                    searchBy = 'category';
                    if (url.length > 2){
                        categoryName = url[2].path;
                        if (url.length > 3) {
                            groupName = url[3].path;
                            if (url.length > 4) {
                                manufacturerName = url[4].path;
                            }
                        }
                    }
                }
                else {
                    manufacturerName = url[1].path;
                    if (url.length > 2) {
                        modelName = url[2].path;
                        if (url.length > 3) {
                            categoryName = url[3].path;
                            if (url.length > 4) {
                                groupName = url[4].path;
                            }
                        }
                    }
                }
            }
        }

        this.getCatalogParamDetailsAsync(manufacturerName, modelName, categoryName, groupName).subscribe((newCatalogState) => {
            const oldSearch = this.catalogState.searchText;
            const oldPage = this.catalogState.page;
            newCatalogState.searchBy = searchBy;
            newCatalogState.searchText = search;
            if (newCatalogState.manufacturer && newCatalogState.model && newCatalogState.category && newCatalogState.group && url.length > 5) {
                newCatalogState.productId = +url[5].path;
            }
            if ((page && page !== oldPage) || !(!page && oldPage === 1)) {
                newCatalogState.page = page;
            }
            console.log(newCatalogState);
            this.setCatalogState(newCatalogState);
        });
    }

    setCatalogStateParams(searchText: string, page?: number): void {
        const oldSearch = this.catalogState.searchText;
        const oldPage = this.catalogState.page;
        let paramsChanged: boolean = false;
        if (searchText !== oldSearch) {
            this.catalogState.searchText = searchText;
            paramsChanged = true;
        }
        if ((page && page !== oldPage) || !(!page && oldPage === 1)) {
            
            this.catalogState.page = (page) ? page : 1;
            paramsChanged = true;
        }
        
        if (paramsChanged) this.catalogStateChanged.next(this.catalogState);
    }

    //----------------------- Next-Level Menu ----------------------------

    getMenuItemListAsync(menuType: string): Observable<CatalogMenuItem[]> {
        let menuItemList: Observable<CatalogMenuItem[]>;

        switch (menuType) {
            case 'manufacturer':
                menuItemList = this.getManufacturerListAsync();
                break;
            case 'model':
                menuItemList = this.getModelListAsync();
                break;
            case 'category':
                menuItemList = this.getCategoryListAsync();
                break;
            case 'group':
                menuItemList = this.getGroupListAsync();
                break;
            default:
                menuItemList = Observable.of([]);        
                break;
        }

        return menuItemList;
    }
    
    getNextLevelMenuAsync(menuType: string = null): Observable<CatalogMenu> {
        if (!menuType) menuType = this.defineNextLevelMenuType();

        return this.getMenuItemListAsync(menuType).map((items) => {
            let nextLevelMenu: CatalogMenu = this.menus.find((menu) => menu.name == menuType);
            if (nextLevelMenu) {
                nextLevelMenu.items = items;
                return nextLevelMenu;
            }
            return null;
        });
    }

    private defineNextLevelMenuType() : string {
        if (this.catalogState.searchBy == 'model') {
            if (this.catalogState.manufacturer) {
                if (this.catalogState.model) {
                    if (this.catalogState.category) {
                        if (this.catalogState.group) {
                            return null; //need to change to define extra menu
                        }
                        else {
                            return 'group';
                        }
                    }
                    else {
                        return 'category';
                    }
                }
                else {
                    return 'model';
                }
            }
            else {
                return 'manufacturer';
            }
        }
        else {
            if (this.catalogState.category) {
                if (this.catalogState.group) {
                    if (this.catalogState.manufacturer) {
                        if (this.catalogState.model) {
                            return null; //need to change to define extra menu
                        }
                        else {
                            return 'model';
                        }
                    }
                    else {
                        return 'manufacturer';
                    }
                }
                else {
                    return 'group';
                }
            }
            else {
                return 'category';
            }
        }
    }

    //------------------------ Catalog Data --------------------

    getManufacturerListAsync(): Observable<CatalogMenuItem[]> {
        return this.getManufacturersAsync().map(
            (response: any[]) => response.map((item) => new CatalogMenuItem(item.name, item.caption))
        )
        .catch((error) => {
            return Observable.of([]);
        });
    }

    getModelListByManufacturerNameAsync(manufacturerName): Observable<CatalogMenuItem[]> {
        if (manufacturerName){
            return this.getManufacturersAsync()
                .flatMap((data: any) => data)
                .first((item: any) => 
                    item.name === manufacturerName,
                    (manufacturer) => {
                        if (manufacturer.models) {
                            return manufacturer.models.map((model) => new CatalogMenuItem(model.name,model.caption))
                        }
                        return [];
                    },
                    [])
                    .defaultIfEmpty([]);
        }
        return Observable.of([]);
    }

    getCategoryListAsync(): Observable<CatalogMenuItem[]> {
        return this.getCategoriesAsync().map(
            (response: any[]) => response.map((item) => new CatalogMenuItem(item.name, item.caption))
        )
        .catch((error) => {
            return Observable.of([]);
        });
    }

    getGroupListByCategoryNameAsync(categoryName): Observable<CatalogMenuItem[]> {
        if (categoryName){
            return this.getCategoriesAsync()
                .flatMap((data: any) => data)
                .first((item: any) => 
                    item.name === categoryName,
                    (category) => {
                        if (category.groups) {
                            return category.groups.map((group) => new CatalogMenuItem(group.name,group.caption))
                        }
                        return [];
                    },
                    [])
                    .defaultIfEmpty([]);
        }
        return Observable.of([]);
    }

    getProductsPageAsync(page?: number): Observable<Pageable<Product>> {
        const pageSize = (this.catalogConfig.extendedView) ? this.catalogConfig.extendedPageSize : this.catalogConfig.pageSize;

        return this.http.get(`${this.url}products.json`)
            .map(
                (body) => {
                    let pageable = new Pageable<Product>();
                    pageable.total = body['total'];
                    let data = [];
                    if (page && pageSize && page > 0 && pageSize > 0) {
                        data = body['data'].slice((page-1) * pageSize, (body['total'] < page * pageSize) ? body['total'] : page * pageSize);
                    }
                    else {
                        data = body['data'];
                    }
                    pageable.data = data.map(this.mapProduct);                    
                    return pageable;
                }
            )
            .catch((error) => {
                let pageable = new Pageable<Product>();
                pageable.total = 0;
                pageable.data = []
                return Observable.of(pageable);
            });
    }

    getProductByIdAsync(productId: number) {
        return this.http.get(`${this.url}/products.json`)
            .map((body) => body['data'].find((item) => item.id === productId))
            .map(this.mapProduct);
    }

    private mapProduct(data: any): Product {
        return new Product(
            data.id,
            data.code,
            data.name,
            data.description,
            new CatalogMenuItem(data.manufacturer.name, data.manufacturer.caption),
            new CatalogMenuItem(data.model.name, data.model.caption),
            data.modification,
            new CatalogMenuItem(data.category.name, data.category.caption),
            new CatalogMenuItem(data.group.name, data.group.caption),
            data.price,
            data.photos || []
        )
    }

    private getManufacturersAsync() {
        return this.http.get(`${this.url}manufacturers.json`);
    }

    private getModelListAsync(): Observable<CatalogMenuItem[]> {
        if (this.catalogState.manufacturer){
            return this.getModelListByManufacturerNameAsync(this.catalogState.manufacturer.name);
        }
        return Observable.of([]);
    }

    private getManufacturerMenuItemByNameAsync(manufacturerName: string): Observable<CatalogMenuItem> {
        return this.getManufacturerListAsync()
            .map((items: CatalogMenuItem[]) => {
                return items.find((item: CatalogMenuItem) => {
                    return item.name === manufacturerName
                });
            });
    }

    private getModelMenuItemByNameTesto(manufacturerName: string, modelName: string): Observable<CatalogMenuItem> {
        return this.getModelListByManufacturerNameAsync(manufacturerName)
            .map((items: CatalogMenuItem[]) => {
                return items.find((item: CatalogMenuItem) => {
                    return item.name === modelName
                })
            });
    }

    private getCategoriesAsync() {
        return this.http.get(`${this.url}categories.json`);
    }

    private getCategoryMenuItemByNameAsync(categoryName: string): Observable<CatalogMenuItem> {
        return this.getCategoryListAsync()
            .map((items: CatalogMenuItem[]) => {
                return items.find((item: CatalogMenuItem) => {
                    return item.name === categoryName
                })
            });
    }
    
    private getGroupListAsync(): Observable<CatalogMenuItem[]> {
        if (this.catalogState.category){
            return this.getGroupListByCategoryNameAsync(this.catalogState.category.name);
        }
        return Observable.of([]);
    }


    private getGroupMenuItemByNameAsync(categoryName: string, groupName: string): Observable<CatalogMenuItem> {
        return this.getGroupListByCategoryNameAsync(categoryName)
            .map((items: CatalogMenuItem[]) => {
                return items.find((item: CatalogMenuItem) => {
                    return item.name === groupName
                })
            });
    }


    private getCatalogParamDetailsAsync(manufacturerName: string, modelName: string, categoryName: string, groupName: string): Observable<CatalogState> {

        const manufacturer: Observable<{ menuType: string, menuItem: CatalogMenuItem}> = this.getManufacturerMenuItemByNameAsync(manufacturerName)
            .map((item: CatalogMenuItem) => {
                return (item) ? { menuType: 'manufacturer', menuItem: item } : null;
            });

        const model: Observable<{ menuType: string, menuItem: CatalogMenuItem}> = this.getModelMenuItemByNameTesto(manufacturerName, modelName)
            .map((item: CatalogMenuItem) => {
                return (item) ? { menuType: 'model', menuItem: item } : null;
            });

        const category: Observable<{ menuType: string, menuItem: CatalogMenuItem}> = this.getCategoryMenuItemByNameAsync(categoryName)
            .map((item: CatalogMenuItem) => {
                return (item) ? { menuType: 'category', menuItem: item } : null;
            });

        const group: Observable<{ menuType: string, menuItem: CatalogMenuItem}> = this.getGroupMenuItemByNameAsync(categoryName, groupName)
            .map((item: CatalogMenuItem) => {
                return (item) ? { menuType: 'group', menuItem: item } : null;
            });

        let menuItems = [];

        if (manufacturerName) {
            menuItems.push(manufacturer);
            if (modelName) menuItems.push(model);
        }
        if (categoryName) {
            menuItems.push(category);
            if (groupName) menuItems.push(group);
        }

        return (menuItems.length > 0) ? Observable.forkJoin(...menuItems).map((data: { menuType: string, menuItem: CatalogMenuItem}[]) => {
            const resultManufacturer = data.find((item) => item && item.menuType === 'manufacturer');
            const resultModel = data.find((item) => item && item.menuType === 'model');
            const resultCategory = data.find((item) => item && item.menuType === 'category');
            const resultGroup = data.find((item) => item && item.menuType === 'group');
            
            return new CatalogState(
                (resultManufacturer) ? resultManufacturer.menuItem : null,
                (resultModel) ? resultModel.menuItem : null,
                (resultCategory) ? resultCategory.menuItem : null,
                (resultGroup) ? resultGroup.menuItem : null
            )
        }) : Observable.of(new CatalogState(null,null,null,null));
    }


    // getFbData() {
    //     return this.getNextLevelMenuAsync();
    // }

    // getFbData2() {
    //     //return this.getCatalogParamDetailsAsync(null,null,null,null);
    //      return this.getCatalogParamDetailsAsync('opel','astra','Детали кузова','капот');
    // }

    // saveTofb() {
    //     let pageable = new Pageable<Product>();
    //     pageable.data = this.products.slice();
    //     pageable.total = this.products.length;
    //     return this.http.put('https://partfinder-8bf92.firebaseio.com/products.json', pageable);
    // }

}