import { createServer } from "http";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

const server = createServer(app);
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
