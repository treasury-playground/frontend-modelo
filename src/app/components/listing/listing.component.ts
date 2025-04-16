import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProjectModalComponent } from '../add-project-modal/add-project-modal.component';

interface Project {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinatorId: number;
  students: { id: number, role: string }[];
}

interface User {
  id: number;
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatPaginatorModule, CommonModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})

export class ListingComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['toggle', 'name', 'description', 'date', 'coordinator', 'students', 'edit', 'select'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();

  projects: Project[] = [];
  users: User[] = [];

  selectedProjects = new SelectionModel<Project>(true, []);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  openAddProjectModal(): void {
    const dialogRef = this.dialog.open(AddProjectModalComponent, {
      width: '80vw', // Use viewport width
      maxWidth: '1200px', // Largura máxima
      autoFocus: false,
      data: {
        title: 'New Project',
        projectName: '',
        coordinator: '',
        students: [],
        description: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aqui você receberá todos os dados formatados:
        console.log('Dados do projeto:', {
          name: result.projectName,
          coordinator: result.coordinator,
          students: result.students,
          description: result.description,
          files: result.files
        });
        // Implemente sua lógica de envio para a API aqui
      }
    });
  }

  ngOnInit() {
    forkJoin({
      projetos: this.apiService.getProjetos(),
      usuarios: this.apiService.getUsuarios()
    }).subscribe(({ projetos, usuarios }) => {
      this.projects = projetos;
      this.users = usuarios;
      this.dataSource.data = this.projects;

      // Força a atualização da view
      this.cdRef.detectChanges();

      // Atribui o paginator e sort após os dados estarem prontos
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
  }

  getUserName(id: number | string): string {
    const user = this.users.find(u => Number(u.id) === Number(id));
    return user ? user.fullName : ' ';
  }

  toggleSelection(project: Project) {
    this.selectedProjects.toggle(project);
    console.log('Projetos selecionados:', this.selectedProjects.selected);
  }

  expandedProject: Project | null = null;

  toggleDetails(project: Project) {
    this.expandedProject = this.expandedProject === project ? null : project;
  }

  deleteSelectedProjects(): void {
    if (this.selectedProjects.selected.length === 0) {
      return;
    }

    const deleteRequests = this.selectedProjects.selected.map((project: Project) =>
      this.apiService.deleteProject(Number(project.id))
    );

    forkJoin(deleteRequests).subscribe({
      next: () => {
        const deletedIds = this.selectedProjects.selected.map((p: Project) => p.id);
        this.projects = this.projects.filter(p => !deletedIds.includes(p.id));
        this.dataSource.data = [...this.projects];
        this.selectedProjects.clear();
      },
      error: err => console.error('Erro ao excluir projetos:', err)
    });
  }

  getCurrentPageStart(): number {
    if (!this.paginator) return 0;

    return this.paginator.pageIndex * this.paginator.pageSize + 1;
  }

  getCurrentPageEnd(): number {
    if (!this.paginator) return 0;
    const end = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    return end > this.dataSource.filteredData.length
      ? this.dataSource.filteredData.length
      : end;
  }

  searchTerm: string = '';

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }
}
