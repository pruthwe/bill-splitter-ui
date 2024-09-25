import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonStorageComponent } from './person-storage.component';

describe('PersonStorageComponent', () => {
	let component: PersonStorageComponent;
	let fixture: ComponentFixture<PersonStorageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PersonStorageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PersonStorageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
