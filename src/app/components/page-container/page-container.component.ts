import { Component } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page-container',
  imports: [TopBarComponent, RouterOutlet],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css'
})
export class PageContainerComponent {

}
