import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoEntrega } from './paso-entrega';

describe('PasoEntrega', () => {
  let component: PasoEntrega;
  let fixture: ComponentFixture<PasoEntrega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoEntrega],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoEntrega);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
