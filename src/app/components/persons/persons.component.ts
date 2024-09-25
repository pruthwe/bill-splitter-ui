import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, model } from '@angular/core';
import {
	MatChipEditedEvent,
	MatChipInputEvent,
	MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../shared/types';

@Component({
	selector: 'app-persons',
	standalone: true,
	imports: [MatChipsModule, MatFormFieldModule, MatIconModule],
	templateUrl: './persons.component.html',
	styleUrl: './persons.component.scss',
})
export class PersonsComponent {
	persons = model<string[]>([]);
	items = model<Item[]>([]);
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	addPerson(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (value) {
			this.persons.update((persons) => [...persons, value]);
		}
		event.chipInput!.clear();
	}

	removePerson(person: string): void {
		this.persons.update((persons) => {
			return persons.filter((p) => p !== person);
		});
	}

	editPerson(person: string, event: MatChipEditedEvent) {
		const value = event.value.trim();
		if (!value) {
			this.removePerson(person);
			return;
		}
		this.persons.update((persons) => {
			return persons.map((p) => (p === person ? value : p));
		});
		this.items.set(
			this.items().map((item) => {
				if (item.splitBetween.includes(person)) {
					item.splitBetween = item.splitBetween.map((p) =>
						p === person ? value : p,
					);
				}
				return item;
			}),
		);
	}
}
