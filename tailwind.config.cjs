module.exports = {
	content: ["./public/index.html", "./src/**/*.svelte"],
	darkMode: "class",
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
