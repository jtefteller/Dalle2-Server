import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export default class Utilities {
	constructor() {
		this.__filename = fileURLToPath(import.meta.url);
		this.__dirname = path.dirname(this.__filename);
		this.publicPath = path.join(this.__dirname, "../../", "public/assets/");
	}
	async writeToDisk(url, filename) {
		const image = await fetch(url);
		const blob = await image.blob();
		const buffer = Buffer.from(await blob.arrayBuffer());
		filename = this.publicPath + filename + ".jpg";
		fs.writeFileSync(filename, buffer);
	}

	tagTitle(title) {
		const date = new Date().getTime();
		title = title.replace(/\n/g, "");
		title = title.replace(/'/g, "");
		title = title.replace(/"/g, "");
		title += `-${date}`;
		return title;
	}
}
