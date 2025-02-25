import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCartComponent } from './svg-cart.component';

describe('SvgCartComponent', () => {
  let component: SvgCartComponent;
  let fixture: ComponentFixture<SvgCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SvgCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
