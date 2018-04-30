import {
    Component,
    ViewChild,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    OnChanges,
    AfterContentInit,
    AfterViewInit,
    SimpleChanges,
    Renderer
} from '@angular/core';


import { TemplateDirective } from '@flxng/common/src/directives';
import { mapToIterable } from '@flxng/common/src/utils';


@Component({
    selector: 'flx-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {

    // constants
    readonly templateTypes: any = {
        //menuHead: 'menuHead'
    };

    @Input() itemsCount: number = 0;
    @Input() pageLinksSize: number = 5; 
    @Input() itemsPerPage: number = 5;    
    @Input() itemsPerPageOptions: number[] = [5, 10, 20, 50, 100];
    @Input() templateRefs: any = {};

    @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onItemsPerPageValueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('itemsPerPageSelectElemRef') itemsPerPageSelectElemRef: ElementRef;

    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;


    pageLinks: number[] = [1];
    visiblePageLinks: number[] = [1];
    currentPage: number = 1;


    constructor(
        private _renderer: Renderer
    ) { }


    ngOnInit(): void {
 
    }

    ngOnChanges(changes: SimpleChanges): void {
         if(changes['itemsCount']) {
             const value = changes['itemsCount'].currentValue;
             if(typeof value !== 'number'  || this.isExpNaN(value) || value < 0) {
                console.warn('`itemsCount` input parameter should be positive number.', `itemsCount: ${value}`);
                this.itemsCount = 0;
             }

             this.init();
         }

         // TODO: this property should not change after initially set!?
         if(changes['pageLinksSize']) {
            const value = changes['pageLinksSize'].currentValue;
            if(typeof value !== 'number' || this.isExpNaN(value) || value < 3) {
                console.warn('`pageLinksSize` input parameter should be positive number greater then 2.', `pageLinksSize: ${value}`);
            }
        }

        // TODO: this property should not change after initially set!?
        if(changes['itemsPerPageOptions']) {
            const value = changes['itemsPerPageOptions'].currentValue;
            if (!Array.isArray(value) || !value.length) {
                console.warn('`itemsPerPageOptions` input parameter should be an array of positive numbers.', `itemsPerPageOptions: ${value}`);
            }
        }

        // TODO: this property should not change after initially set!?
        if(changes['itemsPerPage']) {
            const value = changes['itemsPerPage'].currentValue;
            const isItemsPerPageValueValid = typeof value === 'number' && value > 1;
            const isItemsPerPageOptionsValueValid = Array.isArray(this.itemsPerPageOptions) && this.itemsPerPageOptions.indexOf(value) > -1;
            if (!isItemsPerPageValueValid || !isItemsPerPageOptionsValueValid) {
                console.warn('`itemsPerPage` input parameter should be positive number contained within the `itemsPerPageOptions`.', `itemsPerPage: ${value}, itemsPerPageOptions: ${this.itemsPerPageOptions}`);
            }
        }
    }

    ngAfterContentInit(): void {
        this.collectTemplateRefs();
    }

    ngAfterViewInit(): void {
        this.listenItemsPerPageSelectEvents();
    }

    // ngDoCheck(): void {
    //     //console.log('doCheck!!');
    // }


    init(): void {
        this.pageLinks = [];

        let pageCount = this.getPageCount();

        for (let i = 1; i <= pageCount; ++i) {
            this.pageLinks.push(i);
        }

        this.navigateToPage(1);
    }


    getPageCount(): number {
        return Math.ceil(this.itemsCount / this.itemsPerPage) || 1;
    }


    navigateToPage(p: number, event?: any): void {
        if (event && event.stopPropagation)
            event.stopPropagation();

        if (!this.pageLinks.find(pl => pl === p))
            return;

        this.currentPage = p;
        this.setVisiblePageLinks();

        let endIndex = this.itemsPerPage * this.currentPage;
        let startIndex = endIndex - this.itemsPerPage;

        this.onPageChange.emit({ // TODO: change it so it emits object with skip and take props..
            startIndex: startIndex,
            endIndex: endIndex
        });
    }


    setVisiblePageLinks(): void {
        if (this.pageLinks.length <= this.pageLinksSize) {
            this.visiblePageLinks = this.pageLinks.slice();
            return;
        }

        this.visiblePageLinks = [];
        this.visiblePageLinks.push(this.currentPage);

        let currentPageIdx = this.currentPage - 1;
        let b = 1;

        while (this.visiblePageLinks.length < this.pageLinksSize) {
            if (this.pageLinks[currentPageIdx - b])
                this.visiblePageLinks.push(this.pageLinks[currentPageIdx - b]);

            b = b * -1;

            if (b > 0) b++;
        }

        this.visiblePageLinks.sort((a: number, b: number) => a - b);


        let lowestVisiblePl = this.visiblePageLinks[0];
        let plsPriorLowestVisiblePlExist = this.pageLinks.indexOf(lowestVisiblePl) > 0;
        if (plsPriorLowestVisiblePlExist)
            // remove it so the dots can take place (and total number of visible page links is not greater then value of 'this.pageLinksSize')
            this.visiblePageLinks.splice(0, 1);

        let highestVisiblePl = this.visiblePageLinks[this.visiblePageLinks.length - 1];
        let plsAfterHighestVisiblePlExist = this.pageLinks.indexOf(highestVisiblePl) < this.pageLinks.length - 1;
        if (plsAfterHighestVisiblePlExist)
            // remove it so the dots can take place (and total number of visible page links is not greater then value of 'this.pageLinksSize')
            this.visiblePageLinks.pop();
    }


    shouldShowPaginatorDots(side: string): boolean {
        if (side === 'left') {
            let lowestVisiblePl = this.visiblePageLinks[0];
            let plsPriorLowestVisiblePlExist = this.pageLinks.indexOf(lowestVisiblePl) > 0;
            return plsPriorLowestVisiblePlExist;
        }
        else {
            let highestVisiblePl = this.visiblePageLinks[this.visiblePageLinks.length - 1];
            let plsAfterHighestVisiblePlExist = this.pageLinks.indexOf(highestVisiblePl) < this.pageLinks.length - 1;
            return plsAfterHighestVisiblePlExist;
        }
    }


    listenItemsPerPageSelectEvents(): void {
        this._renderer.listen(this.itemsPerPageSelectElemRef.nativeElement, 'change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.onItemsPerPageValueChange.emit(this.itemsPerPage);
            this.init();
        });
    }


    bindFnContext(fn: Function): Function {
        return fn.bind(this);
    }


    isExpNaN(value): boolean {
        return value !== value;
    }


    collectTemplateRefs(): void {
        this.templateList.toArray().forEach((t: TemplateDirective) => {
            if (!this.templateTypes[t.type]) {
                console.warn(`Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(this.templateTypes).join(', ')}.`);
                return;
            }

            this.templateRefs[t.type] = t.templateRef;
        });
    }

}
