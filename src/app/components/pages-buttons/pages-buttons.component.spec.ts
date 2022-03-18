import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesButtonsComponent } from './pages-buttons.component';

describe('PagesButtonsComponent', () => {
  let component: PagesButtonsComponent;
  let fixture: ComponentFixture<PagesButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
