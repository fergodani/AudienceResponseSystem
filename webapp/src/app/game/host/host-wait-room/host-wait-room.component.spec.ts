import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostWaitRoomComponent } from './host-wait-room.component';

describe('HostWaitRoomComponent', () => {
  let component: HostWaitRoomComponent;
  let fixture: ComponentFixture<HostWaitRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostWaitRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostWaitRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
