import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopBarComponent } from "../top-bar/top-bar.component";
import { PageContainerComponent } from "../page-container/page-container.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, TopBarComponent, PageContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
