import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Project, User } from '../../models/models';
import { ProjectsService } from '../../services/projects.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-listing',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatPaginatorModule, CommonModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './student-listing.component.html',
  styleUrls: ['./student-listing.component.css']
})

export class StudentListingComponent implements OnInit {
  displayedColumns: string[] = ['toggle', 'name', 'description', 'date', 'coordinator', 'students', 'select'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();
  selectedProjects = new SelectionModel<Project>(true, []);

  projects: Project[] = [];
  users: User[] = [];

  // armazenam as refs só quando estiverem disponíveis
  private _sort?: MatSort;
  private _paginator?: MatPaginator;

  @ViewChild('table') table!: MatTable<Project>;

  @ViewChild(MatSort)
  set sort(s: MatSort) {
    this._sort = s;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator)
  set paginator(p: MatPaginator) {
    this._paginator = p;
    this.setDataSourceAttributes();
  }

  constructor(
    private api: ApiService,
    private projectsService: ProjectsService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 1) Carrega lista de usuários
    this.api.getUsuarios().subscribe(u => this.users = u);

    // antes de subscrever ao fluxo de projetos, configure o sortingDataAccessor:
    this.dataSource.sortingDataAccessor = (item: Project, property: string) => {
      switch (property) {
        // ⇩ aqui fazemos a ordenação pelo nome do coordenador ⇩
        case 'coordinator':
          return this.getUserName(item.coordinatorId).toLowerCase();

        // para estudantes, se quiser ordenar por lista de nomes:
        case 'students':
          return item.students
            .map(s => this.getUserName(s.id))
            .join(', ')
            .toLowerCase();

        // demais colunas continuam padrão
        default:
          // “as any” para fugir de erro de tipagem em propriedades dinâmicas
          return (item as any)[property];
      }
    };

    // 2) Sempre que projects$ emitir, atualiza dados + sort/paginator
    this.projectsService.projects$.subscribe(projs => {
      this.dataSource.data = projs;
      this.setDataSourceAttributes();
    });
  }

  /** Só liga sort e paginator quando ambos já existem */
  private setDataSourceAttributes() {
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
