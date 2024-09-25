import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Item } from '../../shared/types';

@Component({
	selector: 'app-item-form',
	standalone: true,
	imports: [
		FormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatInputModule,
	],
	templateUrl: './item-form.component.html',
	styleUrl: './item-form.component.scss',
})
export class ItemFormComponent {
	persons = input<string[]>([]);
	itemName = '';
	itemPrice?: number;
	selected: string[] = [];
	items = model<Item[]>([]);
	addItem() {
		const newItem = {
			name: this.itemName,
			price: this.itemPrice!,
			splitBetween: this.selected,
		};
		this.items.set([...this.items(), newItem]);
		this.itemName = '';
		this.itemPrice = 0;
		this.selected = [];
	}
}