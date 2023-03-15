import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSurveyCourseComponent } from './link-survey-course.component';

describe('LinkSurveyCourseComponent', () => {
  let component: LinkSurveyCourseComponent;
  let fixture: ComponentFixture<LinkSurveyCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkSurveyCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkSurveyCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
