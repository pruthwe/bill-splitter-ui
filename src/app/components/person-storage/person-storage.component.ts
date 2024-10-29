import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../shared/types';

@Component({
	selector: 'app-person-storage',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './person-storage.component.html',
	styleUrl: './person-storage.component.scss',
})
export class PersonStorageComponent {
	persons = model<string[]>([]);
	items = model<Item[]>([]);

	savePersonsToLocalStorage() {
		localStorage.setItem('persons', JSON.stringify(this.persons()));
	}

	getPersonsFromLocalStorage() {
		const persons = localStorage.getItem('persons');
		if (persons) {
			this.persons.set(JSON.parse(persons));
		}
	}

	getItemsFromLocalStorage() {
		this.persons.set(
			JSON.parse(localStorage.getItem('recentPersons') || '[]'),
		);
		this.items.set(JSON.parse(localStorage.getItem('recentItems') || '[]'));
	}

	deletePersonsFromLocalStorage() {
		localStorage.removeItem('persons');
	}
}
