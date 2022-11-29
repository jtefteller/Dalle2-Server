import dotenv from "dotenv";
import express from "express";
import { Configuration } from "openai";
import OpenAIInterface from "../pkg/openAI/openai.js";
dotenv.config();

class openAIRouter {
	constructor(middleware) {
		this.router = express.Router();
		this.middleware = middleware;
		this.configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.openAII = new OpenAIInterface(this.configuration);
	}

	init() {
		this.router.use(this.middleware);
		this.router.use(express.json());
		this.router.use(express.urlencoded({ extended: true }));
		this.router.post("/", async (req, res) => {
			await this.generatePhotoWithTitle(req, res);
		});
		return this.router;
	}

	async generatePhotoWithTitle(req, res) {
		const prompt = req.body.prompt || "";
		const size = req.body.size || "1024x1024";
		const n = req.body.n || 1;
		if (prompt == "" || !prompt) {
			res.status(400).json({ error: "Bad request: prompt is empty" });
			return;
		}
		try {
			const url = await this.openAII.getPhoto(prompt, size, n);
			res.status(200).json({ url: url, error: null });
		} catch (err) {
			res.status(500).json({ error: err });
		}
	}
}

export default openAIRouter;
