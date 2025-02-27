import { Item } from './types';

export function decodeItemsText(text: string) {
    const persons: string[] = [];
    const items : Item[] =[];
    let transactions = text.split(('\n'));
    if(!isValidTransactionText(transactions)) {
        return;
    };
    transactions = transactions.slice(1,-1);
    transactions.forEach((transaction, id) => {
        const [name, price, sharedBetween] = transaction.split(' | ');
        const personsFromTransaction = sharedBetween.split(',');
        items.push({ id: id, name: name, price: +price, splitBetween: personsFromTransaction });
        personsFromTransaction.forEach((person) => {
            if (!persons.includes(person)) {
                persons.push(person);
            }
        })
    })
    return { persons: persons, items: items };
}

export function createItemsTable(items: Item[]) {
    return (
        `Name | Price | Shared between\n` +
        items.map((item) =>
                    `${item.name} | ${item.price} | ${item.splitBetween.join(',')}`,
                ).join(`\n`) +
        `\nTotal | ${getItemTotal(items)}`
    );
}

function isValidTransactionText(transactions: string[]) {
    return transactions[0] === 'Name | Price | Shared between';
}

function getItemTotal(items: Item[]) {
    return items.reduce((total, item) => total + item.price, 0);
}