import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProjectModalComponent } from '../add-project-modal/add-project-modal.component';
import { Project, User } from '../../models/models';
import { EditProjectModalComponent } from '../edit-project-modal/edit-project-modal.component';
import { ProjectsService } from '../../services/projects.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-listing',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatPaginatorModule, CommonModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './teacher-listing.component.html',
  styleUrls: ['./teacher-listing.component.css']
})

export class TeacherListingComponent implements OnInit {
  displayedColumns: string[] = ['toggle', 'name', 'description', 'date', 'coordinator', 'students', 'edit', 'select'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();
  projects: Project[] = [];
  users: User[] = [];

  selectedProjects = new SelectionModel<Project>(true, []);

  @ViewChild('table') table!: MatTable<Project>;

  private _sort?: MatSort;
  private _paginator?: MatPaginator;

  @ViewChild(MatSort)
  set sort(sort: MatSort) {
    this._sort = sort;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    this.setDataSourceAttributes();
  }

  constructor(
    private apiService: ApiService,
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.apiService.getUsuarios().subscribe(u => this.users = u);

    this.dataSource.sortingDataAccessor = (item: Project, property: string) => {
      switch (property) {
        case 'coordinator':
          return this.getUserName(item.coordinatorId).toLowerCase();

        case 'students':
          return item.students
            .map(s => this.getUserName(s.id))
            .join(', ')
            .toLowerCase();

        default:
          return (item as any)[property];
      }
    };

    this.projectsService.projects$.subscribe(projs => {
      this.dataSource.data = projs;
      this.setDataSourceAttributes();
    });
  }

  setDataSourceAttributes() {
    if (this._sort && this._paginator) {
      this.dataSource.sort = this._sort;
      this.dataSource.paginator = this._paginator;
      this._sort.disableClear = true;
    }
  }

  getUserName(id: string): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.fullName : ' ';
  }

  toggleSelection(project: Project) {
    this.selectedProjects.toggle(project);
    console.log('Projetos selecionados:', this.selectedProjects.selected);
  }

  expandedProjectId: string | null = null;

  toggleDetails(project: Project): void {
    this.expandedProjectId = this.expandedProjectId === project.id ? null : project.id;
    this.table.renderRows();
    this.cd.detectChanges();
  }

  isExpanded(project: Project): boolean {
    return this.expandedProjectId === project.id;
  }
  
  isDetailRow = (_: number, row: Project) =>
    row.id === this.expandedProjectId;

  sanitizePdf(b64: string): SafeResourceUrl {
    const url = `data:application/pdf;base64,${b64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  trackById(_: number, project: Project): string {
    return project.id;
  }

  deleteSelectedProjects(): void {
    const toDelete = this.selectedProjects.selected.map(p => p.id);
    toDelete.forEach(id => this.projectsService.delete(id));
    this.selectedProjects.clear();
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

  openAddProjectModal(): void {
    const dialogRef = this.dialog.open(AddProjectModalComponent, {
      height: '90vh',
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

    dialogRef.afterClosed().subscribe((created: Project) => {
      if (created?.id) {
        this.projectsService.add(created);
      }
    });
  }

  openEditProjectModal(project: Project): void {
    const dialogRef = this.dialog.open(EditProjectModalComponent, {
      height: '90vh',
      width: '80vw',
      maxWidth: '1200px',
      autoFocus: false,
      data: project    // passa o objeto completo
    });

    dialogRef.afterClosed().subscribe((updated: Project) => {
      if (updated?.id) {
        this.projectsService.update(updated);
      }
    });
  }
}
