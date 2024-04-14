import { Directive, ViewContainerRef } from "@angular/core";


@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirtective {
    constructor(public viewContainerRef: ViewContainerRef){}
}