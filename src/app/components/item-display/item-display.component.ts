import { Component, model } from '@angular/core';
import { Item } from '../../shared/types';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import {
	ColDef,
	GridApi,
	GridOptions,
	GridReadyEvent,
	INumberCellEditorParams,
	RowSelectionOptions,
} from 'ag-grid-community';

@Component({
	selector: 'app-item-display',
	standalone: true,
	imports: [MatButtonModule, AgGridAngular],
	templateUrl: './item-display.component.html',
	styleUrl: './item-display.component.scss',
})
export class ItemDisplayComponent {
	items = model<Item[]>([]);
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
				return params.value.join(', ');
			},
		},
	];
	gridApi?: GridApi<Item>;

	gridOptions: GridOptions<Item> = {
		autoSizeStrategy: {
			type: 'fitCellContents',
		},
	};

	rowSelection: RowSelectionOptions = {
		mode: 'multiRow',
		enableClickSelection: true,
	};

	onGridReady(params: GridReadyEvent) {
		this.gridApi = params.api;
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
