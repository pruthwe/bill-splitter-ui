import { Component, signal } from '@angular/core';
import { PersonStorageComponent } from './components/person-storage/person-storage.component';
import { PersonsComponent } from './components/persons/persons.component';
import { Item } from './shared/types';
import { SplitComponent } from './components/split/split.component';
import { ItemsComponent } from './components/items/items.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		PersonStorageComponent,
		PersonsComponent,
		SplitComponent,
		ItemsComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'Bill Splitter';
	readonly persons = signal<string[]>([]);
	items = signal<Item[]>([]);
}
