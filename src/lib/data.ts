type Grade = "A" | "B" | "C" | "D" | "F";
export class Billionaire {
	firstName: string;
	lastName: string;
	grade: Grade;
	bio: string;
	wealth: number; // billions
	image: string;
	donated: number; // billions
	impact: number; // billions
	donations: { recipient: string; amount: number; effectiveness: Grade }[]; // amount in millions
	pledged: string; // raw or percentage
	impactRank: number;

	constructor(data: {
		firstName: string;
		lastName: string;
		grade: Grade;
		bio: string;
		wealth: number; // billions
		image: string;
		donated: number; // billions
		impact: number; // billions
		donations: { recipient: string; amount: number; effectiveness: Grade }[]; // amount in millions
		pledged: string; // raw or percentage
		impactRank: number;
	}) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.image = data.image;
		this.grade = data.grade;
		this.bio = data.bio;
		this.wealth = data.wealth;
		this.donated = data.donated;
		this.impact = data.impact;
		this.pledged = data.pledged;
		this.donations = data.donations;
		this.impactRank = data.impactRank;
	}

	get name() {
		return this.firstName + " " + this.lastName;
	}
}

export const billionaires: Billionaire[] = [
	new Billionaire({
		firstName: "Bill",
		lastName: "Gates",
		bio: "Malaria Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "A",
		wealth: 133,
		impact: 14,
		donated: 33, // fake number
		pledged: "95%",
		impactRank: 1,
		donations: [
			{ recipient: "GAVI", amount: 4000, effectiveness: "A" },
			{ recipient: "MALARIA CONSORTIUM", amount: 4, effectiveness: "A" },
		],
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/563px-Bill_Gates_2017_%28cropped%29.jpg",
	}),
	new Billionaire({
		firstName: "Bernard",
		lastName: "Arnault",
		bio: "LVMH Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "D",
		wealth: 158,
		donated: 0.25, // fake number
		impact: 0.6,
		pledged: "0%",
		donations: [{ recipient: "Notre Dame", amount: 200, effectiveness: "D" }],
		impactRank: 3,

		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg/588px-Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg",
	}),
	new Billionaire({
		firstName: "Elon",
		lastName: "Musk",
		bio: "Solar Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "B",
		wealth: 274,
		impact: 9,
		donated: 0.28, // fake number
		pledged: "50%",
		impactRank: 2,
		donations: [{ recipient: "OpenAI", amount: 1, effectiveness: "F" }],
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/580px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
	}),
];
