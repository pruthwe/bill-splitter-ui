import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomSplit } from '../../shared/types';

export interface CustomSplitDialogData {
	persons: string[];
	split?: CustomSplit[];
}

@Component({
    selector: 'app-custom-split-dialog',
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions
    ],
    templateUrl: './custom-split-dialog.component.html',
    styleUrl: './custom-split-dialog.component.scss'
})
export class CustomSplitDialogComponent {
	readonly dialogRef = inject(MatDialogRef<CustomSplitDialogComponent>);
	readonly data = inject<CustomSplitDialogData>(MAT_DIALOG_DATA);
	personSplit: Record<string, number> = {};
	isValidSplit = signal<boolean>(true);

	ngOnInit() {
		if (this.data.persons && this.data.persons.length > 0) {
			if (this.data.split && this.data.split.length > 0) {
				// Initialize with existing split
				this.personSplit = this.data.persons.reduce((acc, person) => {
					const existing = this.data.split?.find(s => s.name === person);
					return { ...acc, [person]: existing ? existing.percent : 0 };
				}, {} as Record<string, number>);
			} else {
				// Default to equal split
				this.personSplit = this.data.persons.reduce((acc, person) => ({ ...acc, [person]: 1 / this.data.persons.length }), {} as Record<string, number>);
			}
		}
	}

	customSplit() {
		console.log(this.personSplit);
		const split = Object.entries(this.personSplit).map(([name, percent]) => (percent > 0 ? { name, percent } : undefined)).filter(Boolean) as CustomSplit[];
		this.dialogRef.close(split);
	}

	checkFormStatus() {
		const total = this.data.persons.reduce((acc, person) => {
			return acc + this.personSplit[person];
		}, 0);
		// Allow some floating point variance
		this.isValidSplit.set(Math.abs(total - 1) < 0.0001);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
