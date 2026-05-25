import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalesComponent } from './locales';

describe('LocalesComponent', () => {
  let component: LocalesComponent;
  let fixture: ComponentFixture<Locales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Locales],
    }).compileComponents();

    fixture = TestBed.createComponent(Locales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
