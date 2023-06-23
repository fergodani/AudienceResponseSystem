import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuestionComponent } from './update-question.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@app/core/services/admin/api.admin.service';
import { ApiServiceStub } from '@app/core/services/stubs/api.admin.service.mock';
import { imports } from '@app/core/services/stubs/imports';

describe('UpdateQuestionComponent', () => {
  let component: UpdateQuestionComponent;
  let fixture: ComponentFixture<UpdateQuestionComponent>;

  beforeEach(async () => {
    let paramMap = new Map<number, string>()
    paramMap.set(1, "1")
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [UpdateQuestionComponent],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        {
          provide: ActivatedRoute, useValue: { snapshot: { paramMap } }
        }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
