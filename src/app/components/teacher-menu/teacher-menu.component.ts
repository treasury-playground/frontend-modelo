import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AddProjectModalComponent } from '../add-project-modal/add-project-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/models';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-teacher-menu',
  imports: [CommonModule],
  templateUrl: './teacher-menu.component.html',
  styleUrl: './teacher-menu.component.css'
})
export class TeacherMenuComponent implements OnInit {
  projects: Project[] = [];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();

  constructor(
    private apiService: ApiService, 
    private dialog: MatDialog, 
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.apiService.getProjetos().subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }

  openAddProjectModal(): void {
    const dialogRef = this.dialog.open(AddProjectModalComponent, {
      height: '90vh',
      width: '80vw', // Use viewport width
      maxWidth: '1200px', // Largura máxima
      autoFocus: false,
      // panelClass: 'custom-dialog-container',
      data: {
        title: 'New Project',
        projectName: '',
        coordinator: '',
        students: [],
        description: ''
      }
    });

    dialogRef.afterClosed().subscribe((created: Project) => {
      if (created && created.id) {
        // Opcional: adiciona imediatamente na lista de projetos em tela
        this.projects.push(created);
        // Ou recarrega do servidor:
        // this.apiService.getProjetos().subscribe(ps => this.projects = ps);
      }
    });

    dialogRef.afterClosed().subscribe((created: Project) => {
      if (created?.id) {
        // 1) Atualiza o array local
        this.projects.push(created);

        // 2) Repassa pro dataSource para re-renderizar
        this.dataSource.data = [...this.projects];

        // 3) (Opcional) força Angular Material a atualizar sort/paginator
        this.cdRef.detectChanges();
      }
    });
  }
}