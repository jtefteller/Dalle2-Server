import fs from "fs";
import https from "https";
export default class Server {
	constructor(app, port) {
		this.app = app;
		this.port = port;
	}

	devServer() {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`);
		});
	}
	prodServer() {
		const options = {
			key: fs.readFileSync("../../config/certs/key.pem"),
			cert: fs.readFileSync("../../config/certs/cert.pem"),
		};
		const httpsServer = https
			.createServer(options, this.app)
			.listen(this.port, () => {
				console.log(`Server running on port ${this.port}`);
			});
	}
}
