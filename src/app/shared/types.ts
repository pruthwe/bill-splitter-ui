export interface Item {
	id: number;
	name: string;
	price: number;
	splitBetween: string[] | CustomSplit[];
}

export interface CustomSplit {
	name: string;
	percent: number;
}
