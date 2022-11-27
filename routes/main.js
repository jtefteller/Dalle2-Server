import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

export default class mainRouter {
	constructor(middleware) {
		this.middleware = middleware;
		this.__filename = fileURLToPath(import.meta.url);
		this.__dirname = path.dirname(this.__filename);
		this.publicPath = path.join(this.__dirname, "../", "public/");
		this.router = express.Router();
	}

	init() {
		this.router.use(this.middleware);
		this.router.use(express.json());
		this.router.use(express.static(this.publicPath));
		this.router.get("/", (req, res) => {
			res.status(200).sendFile(path.join(this.publicPath, "index.html"));
		});

		this.router.get("/photos", (req, res) => {
			fs.readdir(path.join(this.publicPath, "assets/"), (err, files) => {
				if (err) {
					res.status(500).json({ files: [], error: err });
					return;
				}
				const jpgs = files.filter((file) => {
					return file.endsWith(".jpg");
				});
				res.status(200).json({ files: jpgs, error: null });
			});
		});

		this.router.delete("/photo/:id", (req, res) => {
			fs.readdir(path.join(this.publicPath, "assets/"), (err, files) => {
				if (err) {
					res.status(500).json({ message: "", error: err });
					return;
				}
				const jpgs = files.filter((file) => {
					return file.endsWith(".jpg");
				});
				jpgs.forEach((file) => {
					if (file.includes(req.params.id)) {
						fs.unlink(`${this.publicPath}assets/${file}`, (err) => {
							if (err) {
								res.status(500).json({ message: "", error: err });
								return;
							}
							res.status(200).json({ message: "success", error: null });
							return;
						});
					}
				});
			});
		});

		this.router.get("*", (req, res) => {
			res.status(404).send("404: Page not found");
		});
		return this.router;
	}
}
