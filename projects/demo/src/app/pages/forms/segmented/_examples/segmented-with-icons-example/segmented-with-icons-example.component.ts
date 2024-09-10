import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SegmentedButtonComponent, SegmentedComponent } from '@elementar/components/segmented';

@Component({
  selector: 'app-segmented-with-icons-example',
  standalone: true,
  imports: [
    MatIcon,
    SegmentedButtonComponent,
    SegmentedComponent
  ],
  templateUrl: './segmented-with-icons-example.component.html',
  styleUrl: './segmented-with-icons-example.component.scss'
})
export class SegmentedWithIconsExampleComponent {

}
