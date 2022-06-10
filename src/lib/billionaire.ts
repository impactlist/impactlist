import { billionaires as preMapped } from "./data";
import type { Datum } from "./data";

export class Billionaire {
	firstName: string;
	lastName: string;
	bio: string;
	image: string;

	donated: number; // billions
	pledged: number; // millions
	wealth: number; // billions

	dollarImpact: number; // millions
	livesImpact: number; // thousands

	constructor(data: Datum) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.image = data.image;
		this.bio = data.bio;
		this.pledged = data.pledged;
		this.wealth = data.wealth;
		this.donated = data.donated;

		this.dollarImpact = data.dollarImpact;
		this.livesImpact = data.livesImpact;
	}

	get name() {
		return this.firstName + " " + this.lastName;
	}

	get donatedWealthQuotient() {
		return this.donated / this.wealth;
	}

	get donatedLivesSavedQuotient() {
		return Math.round((this.donated * 1_000_000) / this.livesImpact);
	}
}

export const billionaires: Billionaire[] = preMapped.map((b) => new Billionaire(b));
