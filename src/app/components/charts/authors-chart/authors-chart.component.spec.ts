import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsChartComponent } from './authors-chart.component';

describe('PieChartComponent', () => {
  let component: AuthorsChartComponent;
  let fixture: ComponentFixture<AuthorsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
