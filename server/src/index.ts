import express from "express";
import path from "path";
import cors from "cors";
import customersRouter from "./routes/customers";
import dealsRouter from "./routes/deals";
import ticketsRouter from "./routes/tickets";
import npsRouter from "./routes/nps";
import dashboardRouter from "./routes/dashboard";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/nps", npsRouter);
app.use("/api/dashboard", dashboardRouter);

// Serve frontend static files in production
const clientDist = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
