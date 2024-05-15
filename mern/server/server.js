import express from "express";
import cors from "cors";
//import register from "./routes/register.js";
import registerRoute from "./routes/register.js";
import './db/connection.js';


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/register", registerRoute);


// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

export default app;