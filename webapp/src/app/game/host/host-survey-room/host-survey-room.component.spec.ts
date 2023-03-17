import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSurveyRoomComponent } from './host-survey-room.component';

describe('HostSurveyRoomComponent', () => {
  let component: HostSurveyRoomComponent;
  let fixture: ComponentFixture<HostSurveyRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostSurveyRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostSurveyRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
