import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUserCourseComponent } from './link-user-course.component';

describe('LinkUserCourseComponent', () => {
  let component: LinkUserCourseComponent;
  let fixture: ComponentFixture<LinkUserCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkUserCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkUserCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
