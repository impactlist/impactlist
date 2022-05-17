export type Billionaire = {
	name: string;
	bio: string;
	grade: "A" | "B" | "C" | "D" | "F";
	wealth: number;
};

export const billionaires: Billionaire[] = [
	{ name: "Bill Gates", bio: "Microsoft", grade: "A", wealth: 133_000_000_000 },
	{ name: "Bernard Arnault", bio: "LVMH", grade: "D", wealth: 158_000_000_000 },
	{ name: "Elon Musk", bio: "SpaceX", grade: "B", wealth: 274_000_000_000 },
	{ name: "Elon dMusk", bio: "SpaceX", grade: "B", wealth: 274_000_000_000 },
	{ name: "Elon Mfusk", bio: "SpaceX", grade: "B", wealth: 274_000_000_000 },
	{ name: "Elon Muwsk", bio: "SpaceX", grade: "B", wealth: 274_000_000_000 },
	{ name: "Elon Musak", bio: "SpaceX", grade: "B", wealth: 274_000_000_000 },
];
