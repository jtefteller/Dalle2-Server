import express from "express";
import morgan from "morgan";
import Server from "./pkg/server/server.js";
import openAIRouter from "./routes/openai.js";

const app = express();
const port = process.env.PORT || 3000;
const serverInstance = new Server(app, port);

let logger;
if (process.env.NODE_ENV === "production") {
	logger = morgan("combined");
	serverInstance.prodServer();
} else {
	logger = morgan("dev");
	serverInstance.devServer();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/openai", new openAIRouter(logger).init());
