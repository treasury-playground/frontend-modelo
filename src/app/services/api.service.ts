import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  educationalInstitution: string; 
}

export interface Project {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinatorId: number;
  students: Array<{ id: number; role: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // GET
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getProjetos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }
  
  // POST
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  // PUT
  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${project.id}`, project);
  }

  // DELETE
  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${id}`);
  }

}
