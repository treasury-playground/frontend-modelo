import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherListingComponent } from './teacher-listing.component';

describe('TeacherListingComponent', () => {
  let component: TeacherListingComponent;
  let fixture: ComponentFixture<TeacherListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
