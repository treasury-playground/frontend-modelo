import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectIdService {
  /** Contador numérico interno */
  private lastNumeric = 0;
  /** IDs liberados, em string */
  private freedIds: string[] = [];

  constructor(private api: ApiService) {
    // 1) Carrega projetos uma única vez
    this.api.getProjetos().subscribe((projects: Project[]) => {
      // Extrai o maior ID numérico atual
      const numericIds = projects
        .map(p => Number(p.id))
        .filter(n => !isNaN(n));
      this.lastNumeric = numericIds.length
        ? Math.max(...numericIds)
        : 0;

      // 2) Restaura freedIds do localStorage
      const stored = localStorage.getItem('freedProjectIds');
      if (stored) {
        // só mantém aqueles <= lastNumeric
        this.freedIds = JSON.parse(stored)
          .filter((id: string) => {
            const n = Number(id);
            return !isNaN(n) && n <= this.lastNumeric;
          });
      }
    });
  }

  /**
   * Retorna o próximo ID disponível (string).
   * Reusa freedIds antes de incrementar lastNumeric.
   */
  getNextId(): string {
    if (this.freedIds.length > 0) {
      return this.freedIds.shift()!;
    }
    this.lastNumeric++;
    return this.lastNumeric.toString();
  }

  /**
   * Marca um ID como “liberado” (string) para reuso futuro.
   */
  freeId(id: string): void {
    const n = Number(id);
    if (!isNaN(n) && n <= this.lastNumeric && !this.freedIds.includes(id)) {
      this.freedIds.push(id);
      localStorage.setItem('freedProjectIds', JSON.stringify(this.freedIds));
    }
  }
}
