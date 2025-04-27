import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-project-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProjectModalComponent],
  templateUrl: './project-listing.component.html',
  styleUrls: ['./project-listing.component.css']
})
export class ProjectListingComponent implements OnInit {
  isEditMode: boolean = false;
  projectBeingEdited: any = null;

  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 2;
  showModal = false;
  expandedIndex: number | null = null;
  userType: 'teacher' | 'student' = 'teacher';
  selectAll: boolean = false;

  allProjects: any[] = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('userType');
    if (storedUser === 'teacher' || storedUser === 'student') {
      this.userType = storedUser;
    }

    this.loadProjects();
  }

  loadProjects() {
    this.apiService.getProjetos().subscribe({
      next: (projetos) => {
        this.allProjects = projetos.map((proj: any) => ({
          id: proj.id,
          name: proj.name,
          description: proj.description,
          date: proj.date,
          coordinator: proj.coordinator,
          assignedStudents: proj.assignedStudents || [],
          selected: false
        }));
      },
      error: (error) => {
        console.error('Erro ao buscar projetos:', error);
      }
    });
  }

  get filteredProjects() {
    const term = this.searchControl.value?.toLowerCase() || '';
    let filtered = this.allProjects.filter(p => p.name.toLowerCase().includes(term));

    if (this.sortField) {
      filtered = [...filtered].sort((a, b) => {
        const fieldA = (a[this.sortField] || '').toLowerCase?.() || '';
        const fieldB = (b[this.sortField] || '').toLowerCase?.() || '';
        
        if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjects.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  openModal(project: any = null) {
    this.showModal = true;
    this.isEditMode = !!project;
    this.projectBeingEdited = project;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.projectBeingEdited = null;
  }

  toggleDetails(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  toggleSelectAll() {
    this.paginatedProjects.forEach(p => p.selected = this.selectAll);
  }

  hasSelectedProjects(): boolean {
    return this.paginatedProjects.some(p => p.selected);
  }

  onEditProject(project: any) {
    this.openModal(project);
  }

  handleProjectUpdate(updatedProject: any) {
    if (this.isEditMode) {
      this.apiService.updateProjeto(updatedProject.id, updatedProject).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar projeto:', error);
        }
      });
    } else {
      this.apiService.addProjeto(updatedProject).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erro ao salvar projeto:', error);
        }
      });
    }
  }

  deleteSelectedProjects() {
    const selected = this.paginatedProjects.filter(p => p.selected);
    if (selected.length === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${selected.length} selected project(s)?`);
    if (confirmed) {
      selected.forEach(project => {
        this.apiService.deleteProjeto(project.id).subscribe({
          next: () => {
            this.loadProjects();
          },
          error: (error) => {
            console.error('Erro ao deletar projeto:', error);
          }
        });
      });
    }
  }

  downloadSelectedProjects() {
    const selected = this.paginatedProjects.filter(p => p.selected);
    if (selected.length === 0) {
      alert('No projects selected to download.');
      return;
    }

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const userName = localStorage.getItem('userName') || 'user';
    const filename = `projects_${userName}_${formattedDate}.json`;

    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  getSortIcon(field: string) {
    if (this.sortField !== field) {
      return 'bi bi-arrow-down-up'; // Ícone neutro
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }
}
