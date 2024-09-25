import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

interface Item {
  name: string;
  price: number;
  splitBetween: string[];
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            MatToolbarModule,
            FormsModule,
            MatChipsModule,
            MatFormFieldModule,
            MatIconModule,
            MatSelectModule,
            MatFormFieldModule,
            MatInputModule,
            MatListModule,
            MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Bill Splitter';
  readonly persons = signal<string[]>([]);
  items: Item[] = [];
  newPersonName = '';
  itemName = '';
  itemPrice ?: number;
  selected: string[] = [];
  splits?: { [key: string]: number };
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addItem() {
    const newItem = {
      name: this.itemName,
      price: this.itemPrice!,
      splitBetween: this.selected
    };
    this.items = [...this.items, newItem];
    this.itemName = '';
    this.itemPrice = 0;
    this.selected = [];
  }

  removeItem(item: Item) {
    this.items = this.items.filter(i => i.name !== item.name);
  }

  getItemTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  split() {
    let split: { [key: string]: number } = {};

    for (const item of this.items) {
      const itemSplit = item.price / item.splitBetween.length;
      for(const person of item.splitBetween) {
        split[person] = split[person] ? split[person] + itemSplit : itemSplit;
      }
    }

    this.splits = split;
  }

  addPerson(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.persons.update(persons => [...persons, value]);
    }
    event.chipInput!.clear();
  }

  removePerson(person: string): void {
    this.persons.update(persons => {
      return persons.filter(p => p !== person);
    });
  }

  editPerson(person: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removePerson(person);
      return;
    }
    this.persons.update(persons => {
      return persons.map(p => p===person ? value : p);
    });
    this.items = this.items.map(item => {
      if (item.splitBetween.includes(person)) {
        item.splitBetween = item.splitBetween.map(p => p === person ? value : p);
      }
      return item;
    });
  }

  savePersonsToLocalStorage() {
    localStorage.setItem('persons', JSON.stringify(this.persons()));
  }

  getPersonsFromLocalStorage() {
    const persons = localStorage.getItem('persons');
    if (persons) {
      this.persons.set(JSON.parse(persons));
    }
  }

  deletePersonsFromLocalStorage() {
    localStorage.removeItem('persons');
  }

  copyTableToClipboard() {
    const itemsTable = this.createItemsTable();
    navigator.clipboard.writeText(itemsTable);
  }

  createItemsTable() {
    return `Name | Price | Shared between\n`+
    this.items.map(item => `${item.name} | ${item.price} | ${item.splitBetween.join(',')}`).join(`\n`)+
    `\nTotal | ${this.getItemTotal()}`;
  }
}

