import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-person-storage',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './person-storage.component.html',
	styleUrl: './person-storage.component.scss',
})
export class PersonStorageComponent {
	persons = model<string[]>([]);
	savePersonsToLocalStorage() {
		localStorage.setItem('persons', JSON.stringify(this.persons()));
	}

	getPersonsFromLocalStorage() {
		const persons = localStorage.getItem('persons');
		if (persons) {
			this.persons.set(JSON.parse(persons));
		}
	}

	deletePersonsFromLocalStorage() {
		localStorage.removeItem('persons');
	}
}
