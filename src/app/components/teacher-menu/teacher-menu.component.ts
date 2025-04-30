import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectModalComponent } from '../add-project-modal/add-project-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/models';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from '../../services/projects.service';

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
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.projectsService.projects$.subscribe(projs => {
      this.projects = projs;
      // se você usasse dataSource aqui, poderia atualizar também
      this.cdRef.detectChanges();
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
      if (created?.id) {
        this.projectsService.add(created);
      }
    });
  }
}