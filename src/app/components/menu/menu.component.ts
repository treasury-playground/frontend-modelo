import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinatorId: number;
  students: Array<{ id: number; role: string }>;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  projects: Project[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProjetos().subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }
}
