const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./public/index.html", "./src/**/*.svelte"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["verdana", "bitstream vera sans", "dejavu sans", "tahoma", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
