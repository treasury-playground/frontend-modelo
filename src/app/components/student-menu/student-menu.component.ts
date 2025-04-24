import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/models';

@Component({
  selector: 'app-student-menu',
  imports: [CommonModule],
  templateUrl: './student-menu.component.html',
  styleUrl: './student-menu.component.css'
})
export class StudentMenuComponent implements OnInit {
  projects: Project[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProjetos().subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }
}