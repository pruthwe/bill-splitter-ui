import { Component, model } from '@angular/core';
import { CustomSplit, Item } from '../../shared/types';
import { MatButtonModule } from '@angular/material/button';
import { isObjectArray } from '../../shared/utils';

@Component({
	selector: 'app-split',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './split.component.html',
	styleUrl: './split.component.scss',
})
export class SplitComponent {
	persons = model<string[]>([]);
	items = model<Item[]>([]);
	splits?: Record<string, number>;

	split() {
		const split: Record<string, number> = {};
		this.setItemsInLocalStorage();

		for (const item of this.items()) {
			if(isObjectArray<CustomSplit>(item.splitBetween)){
				for (const customSplit of item.splitBetween) {
					const itemSplit = item.price * customSplit.percent;
					split[customSplit.name] = split[customSplit.name]
						? split[customSplit.name] + itemSplit
						: itemSplit;
				}
				continue;
			}
			const itemSplit = item.price / item.splitBetween.length;
			for (const person of item.splitBetween as string[]) {
				split[person] = split[person]
					? split[person] + itemSplit
					: itemSplit;
			}
		}

		this.splits = split;
	}

	setItemsInLocalStorage() {
		localStorage.setItem('recentPersons', JSON.stringify(this.persons()));
		localStorage.setItem('recentItems', JSON.stringify(this.items()));
	}
}
