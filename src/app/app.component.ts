import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

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
            MatFormFieldModule,
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
  persons: string[] = [];
  items: Item[] = [];
  newPersonName = '';
  itemName = '';
  itemPrice ?: number;
  selected: string[] = [];
  splits?: { [key: string]: number };
  addPerson() {
    this.persons = [...this.persons, this.newPersonName];
    this.newPersonName = '';
  }

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
}
