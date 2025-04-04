import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ]
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  showProjects = true;
  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isIcon = target.closest('.bi-person-circle');
    const isDropdown = target.closest('.dropdown-menu');

    if (!isIcon && !isDropdown) {
      this.showUserMenu = false;
    }
  }
}
