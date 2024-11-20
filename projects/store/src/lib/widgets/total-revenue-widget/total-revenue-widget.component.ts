import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DASHBOARD, DashboardWidgetConfig } from '@elementar/components/dashboard';

@Component({
  selector: 'emr-total-revenue-widget',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './total-revenue-widget.component.html',
  styleUrl: './total-revenue-widget.component.scss'
})
export class TotalRevenueWidgetComponent implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input<DashboardWidgetConfig>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.setWidgetLoaded(this.widget()?.id);
    }
  }
}
