const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./public/index.html", "./src/**/*.svelte"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"gotham",
					"helvetica",
					"arial",
					"nimbus sans",
					...defaultTheme.fontFamily.sans,
				],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
