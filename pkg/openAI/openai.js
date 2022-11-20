import { OpenAIApi } from "openai";
import Utilities from "../utils/utilities.js";

export default class OpenAIInterface {
	constructor(configuration) {
		this.openai = new OpenAIApi(configuration);
	}

	async getPhoto(prompt, size) {
		const response = await this.openai.createImage({
			prompt: prompt,
			n: 1,
			size: size,
		});
		const url = response.data.data[0].url;
		const utils = new Utilities();
		let title = await this.generateTitle(prompt);
		title = await utils.tagTitle(title);
		await utils.writeToDisk(url, title);
		return url;
	}

	async generateTitle(prompt) {
		if (!prompt) return "No prompt provided";
		const response = await this.openai.createCompletion({
			model: "text-davinci-002",
			prompt: `Create a title for this kind of image: ${prompt}`,
			temperature: 0.7,
			max_tokens: 2048,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		return await response.data.choices[0].text;
	}
}
