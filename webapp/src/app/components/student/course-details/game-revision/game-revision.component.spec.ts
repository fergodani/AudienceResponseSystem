import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRevisionComponent } from './game-revision.component';

describe('GameRevisionComponent', () => {
  let component: GameRevisionComponent;
  let fixture: ComponentFixture<GameRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRevisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
