import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextLoadComponent } from './next-load.component';

describe('NextLoadComponent', () => {
  let component: NextLoadComponent;
  let fixture: ComponentFixture<NextLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
