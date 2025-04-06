import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-project-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProjectModalComponent],
  templateUrl: './project-listing.component.html',
  styleUrls: ['./project-listing.component.css']
})
export class ProjectListingComponent {
  isEditMode: boolean = false;
  projectBeingEdited: any = null;

  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 2;
  showModal = false;
  expandedIndex: number | null = null;
  userType: 'teacher' | 'student' = 'teacher';
  selectAll: boolean = false;

  allProjects = [
    {
      name: 'Project 1',
      description: '',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.cerros', 'salmonads'],
      selected: false
    },
    {
      name: 'Project 2',
      description: '...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.penna', 'salmonads'],
      selected: false
    },
    {
      name: 'Project 3',
      description: '...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.campos', 'salmonads'],
      selected: false
    },
    {
      name: 'Project 4',
      description: '..',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.junior', 'salmonads'],
      selected: false
    }
  ];
descriptionLength: any;

  get filteredProjects() {
    const term = this.searchControl.value?.toLowerCase() || '';
    return this.allProjects.filter(p =>
      p.name.toLowerCase().includes(term)
    );
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

  openModal() {
    this.showModal = true;
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

  deleteSelectedProjects() {
    const count = this.allProjects.filter(p => p.selected).length;
  
    if (count === 0) return;
  
    const confirmed = window.confirm(`Are you sure you want to delete ${count} selected project(s)?`);
  
    if (confirmed) {
      this.allProjects = this.allProjects.filter(p => !p.selected);
    }
  }
  
  ngOnInit() {
    const storedUser = localStorage.getItem('userType');
    if (storedUser === 'teacher' || storedUser === 'student') {
      this.userType = storedUser;
    }
  }

  downloadSelectedProjects() {
    const selected = this.paginatedProjects.filter(p => p.selected);
  
    if (selected.length === 0) {
      alert('No projects selected to download.');
      return;
    }
  
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
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
  

  
  onEditProject(project: any) {
    this.projectBeingEdited = {
      ...project,
      assignedStudents: project.students.map((s: string) => ({ name: s, role: '' })), 
      files: [] 
    };
    this.isEditMode = true;
    this.showModal = true;
  }
  
  
  
}
