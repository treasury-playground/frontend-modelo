import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  isEditing = false;

  user = {
    name: '',
    email: '',
  };

  projects: { name: string, description: string }[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.user.name = localStorage.getItem('userName') || '';
    this.user.email = localStorage.getItem('userEmail') || '';

    this.loadProjects();
  }

  loadProjects() {
    this.apiService.getProjetos().subscribe({
      next: (data: any[]) => {
        this.projects = data.map(p => ({
          name: p.name,
          description: p.description
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
