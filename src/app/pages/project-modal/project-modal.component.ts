import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent {
  @Output() close = new EventEmitter<void>();

  project = {
    name: '',
    coordinator: '',
    students: '',
    description: ''
  };

  onSave() {
    console.log(this.project);
    this.close.emit();
  }
}
