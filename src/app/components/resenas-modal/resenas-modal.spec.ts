import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasModal } from './resenas-modal';

describe('ResenasModal', () => {
  let component: ResenasModal;
  let fixture: ComponentFixture<ResenasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResenasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResenasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
