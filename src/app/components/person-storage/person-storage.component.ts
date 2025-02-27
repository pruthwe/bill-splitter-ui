import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Item } from '../../shared/types';
import { FormsModule } from '@angular/forms';
import { decodeItemsText } from '../../shared/utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-person-storage',
	standalone: true,
	imports: [MatButtonModule, FormsModule],
	templateUrl: './person-storage.component.html',
	styleUrl: './person-storage.component.scss',
})
export class PersonStorageComponent {
	persons = model<string[]>([]);
	items = model<Item[]>([]);
	itemsText = signal<string>('');
	readonly dialog = inject(MatDialog);

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

	loadTransactionsFromText() {
		this.openDialog();
	}
	openDialog() {
		const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			data: this.itemsText(),
		  });
	  
		  dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				const decoded = decodeItemsText(result);
				if(decoded) {
					this.persons.set(decoded.persons);
					this.items.set(decoded.items);
					this.itemsText.set(result);
				} else {
					alert('Invalid Items text');
				}
			}
		  });
	}
}

@Component({
	selector: 'dialog-overview-example-dialog',
	template: `<h2 mat-dialog-title>Enter Items text</h2>
				<mat-dialog-content>
					<textarea type="text" [(ngModel)]="itemsText"></textarea>
				</mat-dialog-content>
				<mat-dialog-actions>
				<button mat-button (click)="onNoClick()">Cancel</button>
				<button mat-button [mat-dialog-close]="itemsText()" cdkFocusInitial>Submit</button>
				</mat-dialog-actions>`,
	standalone: true,
	imports: [
	  MatFormFieldModule,
	  MatInputModule,
	  FormsModule,
	  MatButtonModule,
	  MatDialogTitle,
	  MatDialogContent,
	  MatDialogActions,
	  MatDialogClose,
	],
  })
  export class DialogOverviewExampleDialog {
	readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
	readonly data = inject<String>(MAT_DIALOG_DATA);
	readonly itemsText = model(this.data);
  
	onNoClick(): void {
	  this.dialogRef.close();
	}
  }