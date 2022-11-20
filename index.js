import express from "express";
import morgan from "morgan";
import Server from "./pkg/server/server.js";
import openAIRouter from "./routes/openai.js";

const app = express();
const logger = morgan("combined");
const port = process.env.PORT || 3000;
const serverInstance = new Server(app, port);

if (process.env.NODE_ENV === "production") {
	serverInstance.prodServer();
} else {
	serverInstance.devServer();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/openai", new openAIRouter(logger).init());
