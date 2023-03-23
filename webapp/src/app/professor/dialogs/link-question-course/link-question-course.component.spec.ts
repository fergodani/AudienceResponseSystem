import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkQuestionCourseComponent } from './link-question-course.component';

describe('LinkQuestionCourseComponent', () => {
  let component: LinkQuestionCourseComponent;
  let fixture: ComponentFixture<LinkQuestionCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkQuestionCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkQuestionCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
