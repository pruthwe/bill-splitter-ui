import { Component, model, computed, input } from '@angular/core';
import { Item } from '../../shared/types';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import {
	ColDef,
	GridApi,
	GridReadyEvent,
	INumberCellEditorParams,
	RowSelectionOptions,
} from 'ag-grid-community';
import { createItemsTable, getSplitBetweenString } from '../../shared/utils';
import { SplitCellEditorComponent } from '../split-cell-editor/split-cell-editor.component';

@Component({
    selector: 'app-item-display',
    imports: [MatButtonModule, AgGridAngular, SplitCellEditorComponent],
    templateUrl: './item-display.component.html',
    styleUrl: './item-display.component.scss'
})
export class ItemDisplayComponent {
	persons = input<string[]>();
	items = model<Item[]>([]);
	total = computed(() =>
		this.items().reduce((total, item) => total + item.price, 0),
	);
	colDefs: ColDef<Item>[] = [
		{ field: 'name', editable: true },
		{
			field: 'price',
			editable: true,
			cellEditor: 'agNumberCellEditor',
			cellEditorParams: {
				min: 0,
				precision: 2,
				step: 1,
				showStepperButtons: true,
			} as INumberCellEditorParams,
		},
		{
			field: 'splitBetween',
			editable: true,
			cellEditor: SplitCellEditorComponent,
			cellEditorPopup: true,
			cellEditorParams: {
				persons: () => this.persons() || [],
			},
			valueSetter: (params) => {
				if (params.newValue !== params.oldValue) {
					params.data.splitBetween = params.newValue;
					return true;
				}
				return false;
			},
			valueFormatter: (params) => {
				if (!params.value || !params.value.length) {
					return 'None';
				}
				return getSplitBetweenString(params.value);
			},
		},
	];
	gridApi?: GridApi<Item>;

	rowSelection: RowSelectionOptions = {
		mode: 'multiRow',
		enableClickSelection: true,
	};

	onGridReady(params: GridReadyEvent) {
		this.gridApi = params.api;
	}

	onCellValueChanged(event: any): void {
		const updatedItem = event.data;
		const items = [...this.items()];
		const index = items.findIndex((i) => i.id === updatedItem.id);
		if (index !== -1) {
			// Replace the item with a new reference so computed properties and child components detect the change deep down
			items[index] = { ...updatedItem };
		}
		this.items.set(items);
	}

	copyTableToClipboard() {
		const itemsTable = this.createItemsTable();
		navigator.clipboard.writeText(itemsTable);
	}

	createItemsTable() {
		return createItemsTable(this.items());
	}

	deleteSelectedItems() {
		const selectedRows = this.gridApi?.getSelectedRows();
		if (selectedRows?.length) {
			this.gridApi?.applyTransaction({ remove: selectedRows });
			this.items.set(
				this.items().filter((item) => !selectedRows.includes(item)),
			);
		}
	}
}
