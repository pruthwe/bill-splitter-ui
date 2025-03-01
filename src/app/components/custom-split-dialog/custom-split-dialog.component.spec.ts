import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSplitDialogComponent } from './custom-split-dialog.component';

describe('CustomSplitDialogComponent', () => {
  let component: CustomSplitDialogComponent;
  let fixture: ComponentFixture<CustomSplitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSplitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
