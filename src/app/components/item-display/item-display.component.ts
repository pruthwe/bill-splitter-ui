import { Component, model } from '@angular/core';
import { Item } from '../../shared/types';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-item-display',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './item-display.component.html',
	styleUrl: './item-display.component.scss',
})
export class ItemDisplayComponent {
	items = model<Item[]>([]);

	removeItem(item: Item) {
		this.items.set(this.items().filter((i) => i.name !== item.name));
	}
	getItemTotal() {
		return this.items().reduce((total, item) => total + item.price, 0);
	}

	copyTableToClipboard() {
		const itemsTable = this.createItemsTable();
		navigator.clipboard.writeText(itemsTable);
	}

	createItemsTable() {
		return (
			`Name | Price | Shared between\n` +
			this.items()
				.map(
					(item) =>
						`${item.name} | ${item.price} | ${item.splitBetween.join(',')}`,
				)
				.join(`\n`) +
			`\nTotal | ${this.getItemTotal()}`
		);
	}
}
