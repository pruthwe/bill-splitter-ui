import { Component, inject, signal, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { CustomSplitDialogComponent } from '../custom-split-dialog/custom-split-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomSplit } from '../../shared/types';
import { getSplitBetweenString, isObjectArray } from '../../shared/utils';

interface SplitCellEditorParams extends ICellEditorParams {
    persons: () => string[];
}

@Component({
    selector: 'app-split-cell-editor',
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule
    ],
    templateUrl: './split-cell-editor.component.html',
    styles: [`
		.split-editor-container {
			background: white;
			border-radius: 8px;
			min-width: 250px;
			box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		}
	`]
})
export class SplitCellEditorComponent implements ICellEditorAngularComp {
    params!: SplitCellEditorParams;
    persons = signal<string[]>([]);
    selected: string[] = [];
    isCustomSplit = signal(false);
    customSplitValue: CustomSplit[] = [];
    readonly dialog = inject(MatDialog);
    private dialogOpen = false;

    @HostListener('window:click', ['$event'])
    onClick(event: MouseEvent) {
        // AG Grid closes the popup editor when a click happens outside the cell editor element.
        // Material's select dropdown and dialogs are appended to the body, not inside this component.
        // If the click is inside a cdk-overlay-container (which contains both mat-select options and dialogues),
        // we need to stop ag-grid from processing it.
        const target = event.target as HTMLElement;
        if (target.closest('.cdk-overlay-container')) {
            event.stopPropagation();
        }
    }

    agInit(params: SplitCellEditorParams): void {
        this.params = params;
        if (params.persons) {
            this.persons.set(params.persons());
        }

        if (isObjectArray<CustomSplit>(params.value)) {
            this.isCustomSplit.set(true);
            this.customSplitValue = [...params.value];
        } else {
            this.isCustomSplit.set(false);
            this.selected = Array.isArray(params.value) ? [...params.value] : [];
        }
    }

    getValue() {
        return this.isCustomSplit() ? [...this.customSplitValue] : [...this.selected];
    }

    isPopup(): boolean {
        return true;
    }

    save() {
        this.params.stopEditing();
    }

    customSplit() {
        if (this.isCustomSplit()) {
            this.isCustomSplit.set(false);
            this.customSplitValue = [];
            // Reset selection to all persons if canceling custom split, or keep previous logic?
            // Let's reset to all persons to match user's previous flow
            this.selected = [...this.persons()];
            return;
        }

        this.dialogOpen = true;
        const dialogRef = this.dialog.open(CustomSplitDialogComponent, {
            data: {
                persons: this.persons(),
                split: this.isCustomSplit() ? this.customSplitValue : undefined,
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            this.dialogOpen = false;
            if (result !== undefined) {
                this.customSplitValue = result;
                this.isCustomSplit.set(true);
                this.params.stopEditing();
            }
        });
    }

    getCustomSplitText() {
        return this.customSplitValue?.length > 0 ? getSplitBetweenString(this.customSplitValue) : 'None';
    }
}
