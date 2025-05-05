import { TestBed } from '@angular/core/testing';

import { ProjectIdService } from './project-id.service';

describe('ProjectIdService', () => {
  let service: ProjectIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
