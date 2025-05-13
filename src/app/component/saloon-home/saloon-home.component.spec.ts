import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaloonHomeComponent } from './saloon-home.component';

describe('SaloonHomeComponent', () => {
  let component: SaloonHomeComponent;
  let fixture: ComponentFixture<SaloonHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaloonHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaloonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
