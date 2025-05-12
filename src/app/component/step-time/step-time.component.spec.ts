import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTimeComponent } from './step-time.component';

describe('StepTimeComponent', () => {
  let component: StepTimeComponent;
  let fixture: ComponentFixture<StepTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
