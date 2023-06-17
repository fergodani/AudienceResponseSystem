import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGameComponent } from './student-game.component';

describe('StudentGameComponent', () => {
  let component: StudentGameComponent;
  let fixture: ComponentFixture<StudentGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
