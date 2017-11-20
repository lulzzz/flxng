import {
    Directive,
    Input,
    Output,
    NgZone,
    Renderer,
    ElementRef,
    OnInit,
    OnChanges,
    AfterViewChecked,
    SimpleChanges,
    EventEmitter
} from '@angular/core';

@Directive({
    selector: '[flxObserveWidth]'
})
export class ObserveWidthDirective implements OnInit, OnChanges, AfterViewChecked {

    @Input('flxObserveWidth') shouldObserve: boolean = false;

    @Output() onWidthChange: EventEmitter<string> = new EventEmitter<string>();

    width: string = '';
    windowResizeListener: any;

    constructor(
        private _ngZone: NgZone,
        private _renderer: Renderer,
        private _elementRef: ElementRef
    ) { }


    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(getComputedStyle(this._elementRef.nativeElement).width);
        if(changes.shouldObserve) {
            if(changes.shouldObserve.currentValue) {
                this._ngZone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.width = getComputedStyle(this._elementRef.nativeElement).width;
                        this.onWidthChange.emit(this.width);

                        this.windowResizeListener = this._renderer.listen(window, 'resize', (e) => {
                            let width = getComputedStyle(this._elementRef.nativeElement).width;
                            if(this.width !== width) {
                                this.width = width;
                                this.onWidthChange.emit(this.width);
                            }
                        });
                    });
                });
            }
            else {
                if(this.width) {
                    this.width = '';
                    this.onWidthChange.emit(this.width);
                }

                if(this.windowResizeListener) {
                    this.windowResizeListener() // unbind
                }
            }
        }
    }

    ngAfterViewChecked(): void {
        if(!this.shouldObserve) {
            return;
        }

        let width = getComputedStyle(this._elementRef.nativeElement).width;
        if(width !== this.width) {
            this.width = width;
            this.onWidthChange.emit(this.width);
       }
    }



}
