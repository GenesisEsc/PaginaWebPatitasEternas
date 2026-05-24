import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoIdentificacion } from './paso-identificacion';

describe('PasoIdentificacion', () => {
  let component: PasoIdentificacion;
  let fixture: ComponentFixture<PasoIdentificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoIdentificacion],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoIdentificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
