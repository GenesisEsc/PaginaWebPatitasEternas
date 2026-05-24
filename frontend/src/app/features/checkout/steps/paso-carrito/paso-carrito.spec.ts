import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoCarrito } from './paso-carrito';

describe('PasoCarrito', () => {
  let component: PasoCarrito;
  let fixture: ComponentFixture<PasoCarrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoCarrito],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoCarrito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
