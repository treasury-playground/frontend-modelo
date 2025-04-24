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
import { Project, User } from '../../models/models';

@Component({
  selector: 'app-student-listing',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule],
  templateUrl: './student-listing.component.html',
  styleUrls: ['./student-listing.component.css']
})

export class StudentListingComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['toggle', 'name', 'description', 'date', 'coordinator', 'students', 'select'];
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
