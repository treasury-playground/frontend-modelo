import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class ProfileComponent {
  isEditing = false;

  user = {
    name: 'Adalberto Farias',
    email: 'adalbertofarias@email.com',
  };

  projects = [
    { name: 'Project 1', description: 'Brief Description' },
    { name: 'Project 3', description: 'Brief Description' },
    { name: 'Project 4', description: 'Brief Description' },
  ];

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
