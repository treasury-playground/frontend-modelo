// src/app/services/projects.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateProjectDto, Project } from '../models/models';
import { ProjectIdService } from './project-id.service';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private _projects$ = new BehaviorSubject<Project[]>([]);
  public projects$: Observable<Project[]> = this._projects$.asObservable();

  constructor(
    private api: ApiService,
    private idService: ProjectIdService
  ) {
    // carrega a lista inicial do backend
    this.reload();
  }

  /** Recarrega tudo do servidor */
  reload() {
    this.api.getProjetos()
      .subscribe(projs => this._projects$.next(projs));
  }

  /**
   * Cria um novo projeto:
   * - gera ID com ProjectIdService
   * - faz POST no backend
   * - empurra o resultado para o BehaviorSubject
   */
  add(dto: CreateProjectDto) {
    const manualId = this.idService.getNextId().toString();
    const toCreate: Project = { id: manualId, ...dto };

    this.api.createProject(toCreate)
      .subscribe(() => {
        this._projects$.next([...this._projects$.value, toCreate]);
      });
  }

  /** Deleta e “libera” o ID no ProjectIdService */
  delete(id: string) {
    this.api.deleteProject(id)
      .subscribe(() => {
        this.idService.freeId(id);
        this._projects$.next(
          this._projects$.value.filter(p => p.id !== id)
        );
      });
  }

  /** Atualiza via PUT + BehaviorSubject */
  update(project: Project) {
    this.api.updateProject(project)
      .subscribe(updated => {
        const arr = this._projects$.value.map(p =>
          p.id === updated.id ? updated : p
        );
        this._projects$.next(arr);
      });
  }
}
