/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./public/**/*.{html,js}"],
	theme: {
		extend: {
			transitionDuration: {
				0: "0ms",
				5000: "5000ms",
			},
			minHeight: {
				0: "0",
				"1/4": "25%",
				"1/2": "50%",
				"3/4": "75%",
				full: "100%",
				300: "300px",
			},
			animation: {
				fade: "fadeOut 5s ease-in-out",
			},
			keyframes: (theme) => ({
				fadeOut: {
					"0%": { backgroundColor: theme("colors.red.400") },
					"100%": { backgroundColor: theme("colors.transparent") },
				},
			}),
		},
	},
	plugins: [],
};
