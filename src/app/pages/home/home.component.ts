import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { ApiService } from '../../services/api.service';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProjectModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  projects: any[] = [];
  showModal = false;
  userType: 'teacher' | 'student' = 'student';
  userName: string = '';
  searchControl = new FormControl('');
  isEditMode = false;
  projectBeingEdited: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const storedType = localStorage.getItem('userType');
    if (storedType === 'teacher' || storedType === 'student') {
      this.userType = storedType;
    }

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }

    this.loadProjects();
  }

  loadProjects() {
    this.apiService.getProjetos().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos na Home:', error);
      }
    });
  }

  openModal(project: any = null) {
    this.showModal = true;
    this.isEditMode = !!project;
    this.projectBeingEdited = project;
  }

  closeModal() {
    this.showModal = false;
    this.projectBeingEdited = null;
    this.isEditMode = false;
  }

  handleSaveProject(project: any) {
    if (this.isEditMode) {
      this.apiService.updateProjeto(project.id, project).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          this.updateUserProjects(); // Atualiza os projetos do usuário
          this.closeModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar projeto na Home:', error);
        }
      });
    } else {
      this.apiService.addProjeto(project).subscribe({
        next: (savedProject) => {
          this.projects = [savedProject, ...this.projects];
          this.updateUserProjects(); // Atualiza os projetos do usuário
          this.closeModal();
        },
        error: (error) => {
          console.error('Erro ao salvar projeto na Home:', error);
        }
      });
    }
  }
  updateUserProjects() {
    localStorage.setItem('userProjects', JSON.stringify(this.projects));
  }
    
  

  get filteredProjects() {
    const term = this.searchControl.value?.toLowerCase() || '';
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  onEditProject(project: any) {
    this.openModal(project);
  }
}
