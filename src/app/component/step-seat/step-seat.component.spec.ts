import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSeatComponent } from './step-seat.component';

describe('StepSeatComponent', () => {
  let component: StepSeatComponent;
  let fixture: ComponentFixture<StepSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepSeatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
