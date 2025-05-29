import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateSlideContent } from "./utils/generateSlides";
import { generatePDF } from "./utils/htmlToPdf";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/generate-deck", async (req: Request, res: Response): Promise<void> => {
  const { idea, industry, tone = "professional" } = req.body;

  const slideTypes = ["Problem", "Solution", "Market", "Team", "Business Model"];

  try {
    const slides = await Promise.all(
      slideTypes.map(async (slideType) => ({
        title: slideType,
        content: await generateSlideContent(slideType, idea, industry, tone),
      }))
    );

    res.json({ slides });
  } catch (error) {
    console.error("❌ Error generating slides:", error);
    res.status(500).json({ error: "Failed to generate slides" });
  }
});

app.post("/download-deck", async (req: Request, res: Response): Promise<void> => {
  const { slides } = req.body;

  if (!slides || !Array.isArray(slides)) {
    res.status(400).json({ error: "Missing or invalid slides array" });
    return;
  }

  try {
    const pdfBuffer = await generatePDF(slides);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=deck.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});
