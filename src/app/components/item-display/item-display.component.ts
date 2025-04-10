import { Component, model, computed } from '@angular/core';
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

@Component({
	selector: 'app-item-display',
	standalone: true,
	imports: [MatButtonModule, AgGridAngular],
	templateUrl: './item-display.component.html',
	styleUrl: './item-display.component.scss',
})
export class ItemDisplayComponent {
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
		this.items.set([...this.items()]);
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
