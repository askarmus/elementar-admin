import {
  AfterContentInit,
  afterNextRender, AfterViewChecked,
  Component,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input, PLATFORM_ID,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { GridStackItemDefDirective } from '../grid-stack-item-def.directive';
import { GridStackItem } from '../types';
import { isPlatformServer, NgTemplateOutlet } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'emr-grid-stack',
  exportAs: 'emrGridStack',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkDrag
  ],
  templateUrl: './grid-stack.component.html',
  styleUrl: './grid-stack.component.scss',
  host: {
    'class': 'emr-grid-stack',
    '[class.is-dragging-active]': '_isDraggingActive',
  }
})
export class GridStackComponent implements AfterViewChecked, AfterContentInit {
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _platformId = inject(PLATFORM_ID);
  private _defs = contentChildren(GridStackItemDefDirective);
  items = input.required<GridStackItem[]>();

  protected _items: GridStackItem[] = [];
  protected _initialized = false;
  private _defsMap = new Map<string, TemplateRef<any>>();
  protected _placeholder = {
    w: 0,
    h: 0,
    x: 0,
    y: 0
  };
  protected _isDraggingActive = false;
  private _rootElementWidth = 0;
  private _rootElementHeight = 0;

  constructor() {
    effect(() => {
      this._items = this.items();
      this._calculateRootElementHeight();
    });
  }

  ngAfterViewChecked() {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    const width = this._elementRef.nativeElement.getBoundingClientRect().width;

    if (width !== this._rootElementWidth) {
      this._rootElementWidth = width;
    }
  }

  ngAfterContentInit() {
    this._defs().forEach((def: GridStackItemDefDirective) => {
      this._defsMap.set(def.emrGridStackItemDef(), def.templateRef);
    });
    this._initialized = true;
  }

  getItemTemplate(type: string): TemplateRef<any> {
    if (!this._defsMap.has(type)) {
      throw new Error(`Invalid type "${type}" for grid stack item def`);
    }

    return this._defsMap.get(type) as TemplateRef<any>;
  }

  onDragStarted(event: any, item: GridStackItem): void {
    const dragElement = event.source.element.nativeElement;
    const dimensions = dragElement.getBoundingClientRect();
    this._renderer.setStyle(dragElement, 'max-width', dimensions.width + 'px');
    this._renderer.setStyle(dragElement, 'top', dimensions.y + 'px');
    this._renderer.setStyle(dragElement, 'left', dimensions.x + 'px');
    this._isDraggingActive = true;
    this._placeholder = {
      w: item.w,
      h: item.h,
      x: item.x,
      y: item.y,
    };
  }

  onDragEnded(event: any, item: GridStackItem, dragRef: CdkDrag): void {
    const dragElement = event.source.element.nativeElement;
    this._isDraggingActive = false;
    this._placeholder = {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    };
    this._renderer.removeStyle(dragElement, 'max-width');
    this._renderer.removeStyle(dragElement, 'top');
    this._renderer.removeStyle(dragElement, 'left');
    dragRef.reset();
  }

  onDragMoved(event: any, item: GridStackItem, dragRef: CdkDrag): void {
    console.log(this._rootElementWidth);
    console.log(this._rootElementHeight);
  }

  private _calculateRootElementHeight(): void {
    let y = 0;
    let h = 0;
    this.items().forEach((item: GridStackItem) => {
      if (item.y > y) {
        y = item.y;
      }

      if (item.h > h) {
        h = item.h;
      }
    });
    this._rootElementHeight = (y + h) * 100;
    this._renderer.setStyle(this._elementRef.nativeElement, 'height', this._rootElementHeight + 'px');
  }
}