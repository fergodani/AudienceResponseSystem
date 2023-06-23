import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { imports } from '@app/core/services/stubs/imports';
import { SurveyListComponent } from '../survey-list/survey-list.component';
import { QuestionListComponent } from '../question-list/question-list.component';
import { CourseListComponent } from '@app/components/admin/course-list/course-list.component';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [LibraryComponent, SurveyListComponent, QuestionListComponent, CourseListComponent],
      providers: [
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
