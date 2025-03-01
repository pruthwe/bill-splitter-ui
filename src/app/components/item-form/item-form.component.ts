import {
	Component,
	inject,
	input,
	model,
	OnChanges,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomSplit, Item } from '../../shared/types';
import { CustomSplitDialogComponent } from '../custom-split-dialog/custom-split-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getSplitBetweenString } from '../../shared/utils';

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
export class ItemFormComponent implements OnChanges {
	persons = input<string[]>();
	itemName = '';
	itemPrice?: number;
	selected: string[] = [];
	items = model<Item[]>([]);
	isCustomSplit = signal(false);
	customSplitValue: CustomSplit[] = [];
	readonly dialog = inject(MatDialog);

	ngOnChanges(changes: SimpleChanges) {
		if (changes['persons'] && this.persons()) {
			this.selected = [...this.persons()!];
		}
	}

	addItem() {
		const newItem = {
			id: this.items().length,
			name: this.itemName,
			price: this.itemPrice!,
			splitBetween: this.isCustomSplit() ? this.customSplitValue : this.selected,
		};
		this.items.set([...this.items(), newItem]);
		this.itemName = '';
		this.itemPrice = 0;
		this.selected = [...this.persons()!];
	}

	customSplit() {
		const dialogRef = this.dialog.open(CustomSplitDialogComponent, {
			data: this.persons(),
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				console.log(result);
				this.customSplitValue = result;
				this.isCustomSplit.set(true);
			}
		});
	}

	getCustomSplitText() {
		return this.customSplitValue?.length > 0 ? getSplitBetweenString(this.customSplitValue) : 'None'
	}
}
