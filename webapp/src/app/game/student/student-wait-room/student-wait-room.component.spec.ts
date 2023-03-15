import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWaitRoomComponent } from './student-wait-room.component';

describe('StudentWaitRoomComponent', () => {
  let component: StudentWaitRoomComponent;
  let fixture: ComponentFixture<StudentWaitRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentWaitRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentWaitRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
