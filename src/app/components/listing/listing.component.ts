import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

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
  // outros atributos...
}

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'description', 'date', 'coordinator', 'students', 'select'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();

  projects: Project[] = [];
  users: User[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Project[]>('http://localhost:3000/projects')
      .subscribe(data => {
        this.projects = data;
        this.dataSource.data = this.projects;
      });

    this.http.get<User[]>('http://localhost:3000/users')
      .subscribe(data => {
        this.users = data;
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.fullName : '';
  }
}
