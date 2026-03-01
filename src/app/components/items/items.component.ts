import { Component, input, model } from '@angular/core';
import { ItemDisplayComponent } from '../item-display/item-display.component';
import { Item } from '../../shared/types';
import { ItemFormComponent } from '../item-form/item-form.component';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-items',
	standalone: true,
	imports: [ItemDisplayComponent, ItemFormComponent, MatCardModule],
	templateUrl: './items.component.html',
	styleUrl: './items.component.scss',
})
export class ItemsComponent {
	persons = input.required<string[]>();
	items = model<Item[]>([]);
}
