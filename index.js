import express from "express";
import morgan from "morgan";
import server from "./pkg/server/server.js";
import openAIRouter from "./routes/openai.js";
import mainRouter from "./routes/main.js";

const app = express();
const logger = morgan("combined");
const port = process.env.PORT || 3000;
const serverInstance = new server(app, port);

if (process.env.NODE_ENV === "production") {
	serverInstance.prodServer();
} else {
	serverInstance.devServer();
}

app.use(express.json());
app.use("/", new mainRouter(logger).init());
app.use("/openai", new openAIRouter(logger).init());
