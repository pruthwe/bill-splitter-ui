import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomSplit } from '../../shared/types';

@Component({
	selector: 'app-custom-split-dialog',
	standalone: true,
	imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions],
	templateUrl: './custom-split-dialog.component.html',
	styleUrl: './custom-split-dialog.component.scss'
})
export class CustomSplitDialogComponent {
	readonly dialogRef = inject(MatDialogRef<CustomSplitDialogComponent>);
	readonly persons = inject<string[]>(MAT_DIALOG_DATA);
	personSplit: Record<string, number> = {};
	isValidSplit = signal<boolean>(true);

	ngOnInit() {
		if (this.persons && this.persons.length > 0) {
			this.personSplit = this.persons.reduce((acc, person) => ({ ...acc, [person]: 1 / this.persons.length }), {} as Record<string, number>)
		}
	}

	customSplit() {
		console.log(this.personSplit);
		const split = Object.entries(this.personSplit).map(([name, percent]) => (percent > 0 ? { name, percent } : undefined)).filter(Boolean) as CustomSplit[];
		this.dialogRef.close(split);
	}

	checkFormStatus() {
		const total = this.persons.reduce((acc, person) => {
			return acc + this.personSplit[person];
		}, 0);
		this.isValidSplit.set(total === 1);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
