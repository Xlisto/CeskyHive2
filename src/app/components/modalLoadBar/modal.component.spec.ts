import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoadBarComponent } from './modalLoadBar.component';

describe('ModalComponent', () => {
  let component: ModalLoadBarComponent;
  let fixture: ComponentFixture<ModalLoadBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLoadBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoadBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
