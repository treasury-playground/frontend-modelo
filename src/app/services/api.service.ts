import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`);
  }

  getProjetos(): Observable<any> { 
    return this.http.get(`${this.baseUrl}/projects`);
  }

  addProjeto(projeto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, projeto);
  }

  updateProjeto(id: number, projeto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/${id}`, projeto);
  }

  deleteProjeto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${id}`);
  }
}
