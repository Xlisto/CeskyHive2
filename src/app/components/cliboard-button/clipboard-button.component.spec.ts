import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliboardButtonComponent } from './clipboard-button.component';

describe('CliboardButtonComponent', () => {
  let component: CliboardButtonComponent;
  let fixture: ComponentFixture<CliboardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CliboardButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CliboardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
