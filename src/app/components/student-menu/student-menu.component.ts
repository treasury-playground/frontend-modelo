import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/models';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-student-menu',
  imports: [CommonModule],
  templateUrl: './student-menu.component.html',
  styleUrl: './student-menu.component.css'
})
export class StudentMenuComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.projects$.subscribe(projs => {
      this.projects = projs;
    });
  }
}