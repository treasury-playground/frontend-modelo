import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModalComponent } from '../project-modal/project-modal.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  projects = [
    { name: 'Project 1', description: 'Brief Description' },
    { name: 'Project 2', description: 'Brief Description' },
    { name: 'Project 3', description: 'Brief Description' },
    { name: 'Project 4', description: 'Brief Description' },
  ];

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
