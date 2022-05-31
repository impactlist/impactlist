type Grade = "A" | "B" | "C" | "D" | "F";
export type Billionaire = {
	name: string;
	grade: Grade;
	esotericGrade: Grade;
	bio: string;
	esotericBio: string;
	wealth: number; // billions
	image: string;
	donated: number; // billions
	impact: number; // billions
	donations: { recipient: string; amount: number; effectiveness: Grade }[]; // amount in millions
	pledged: string; // raw or percentage
	impactRank: number;
};

export const billionaires: Billionaire[] = [
	{
		name: "Bill Gates",
		bio: "Malaria Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "A",
		esotericGrade: "A",
		esotericBio:
			"Malaria Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
	},
	{
		name: "Bernard Arnault",
		bio: "LVMH Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "D",
		esotericGrade: "D",
		esotericBio:
			"LVMH Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		wealth: 158,
		donated: 0.25, // fake number
		impact: 0.6,
		pledged: "0%",
		donations: [{ recipient: "Notre Dame", amount: 200, effectiveness: "D" }],
		impactRank: 3,

		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg/588px-Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg",
	},
	{
		name: "Elon Musk",
		bio: "Solar Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		grade: "B",
		esotericGrade: "A",
		esotericBio:
			"Mars Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		wealth: 274,
		impact: 9,
		donated: 0.28, // fake number
		pledged: "50%",
		impactRank: 2,
		donations: [{ recipient: "OpenAI", amount: 1, effectiveness: "F" }],
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/580px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
	},
	// {
	// 	name: "Larry Page",
	// 	bio: "Google Foundation Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	// 	grade: "D",
	// 	esotericGrade: "D",
	// 	esotericBio:
	// 		"Google Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	// 	wealth: 111,
	// 	donated: 0.021, // fake number
	// 	pledged: "0%",
	// 	donations: [{ recipient: "Shoo The Flu", amount: 0.8, effectiveness: "D" }],
	// 	impactRank: 4,
	// 	image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg/666px-Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg",
	// },
];
