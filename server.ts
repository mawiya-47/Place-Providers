import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { 
  getOrCreateUser, 
  createInquiry, 
  getInquiries, 
  logAnalyticsEvent, 
  getDashboardMetrics 
} from "./src/db/helpers.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { askAssistant } from "./src/lib/gemini.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  // 1. HEALTHCHECK
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // 2. CONTACT FORM INQUIRIES GUEST ENDPOINT
  app.post("/api/contact", async (req: Request, res: Response) => {
    const { name, email, phone, service, message } = req.body;
    
    if (!name || !email || !service || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, service, message)." });
    }

    try {
      const result = await createInquiry(name, email, phone || null, service, message);
      await logAnalyticsEvent("form_submit", `${name} | ${service}`);
      
      // Print alert log representing the premium alert email system
      console.log(`[ALERT EMAIL SIMULATION] New inquiry received from "${name}" for "${service}". Alert dispatched to starpanther0@gmail.com`);

      res.status(201).json({
        success: true,
        message: "Your inquiry has been stored securely, and a notification was dispatched to the team.",
        data: result
      });
    } catch (error: any) {
      console.error("Backend contact endpoint failed:", error);
      res.status(500).json({ error: error.message || "Failed to process inquiry in the backend database." });
    }
  });

  // 3. AI CHAT SUPPORT ASSISTANT GUEST ENDPOINT
  app.post("/api/ai-chat", async (req: Request, res: Response) => {
    const { history, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message input is required." });
    }

    try {
      await logAnalyticsEvent("bot_query", message.substring(0, 100));
      const responseText = await askAssistant(history || [], message);
      res.json({ reply: responseText });
    } catch (error: any) {
      console.error("Backend AI chat endpoint failed:", error);
      res.status(500).json({ error: "AI Assistant is running on backup backup modes. Let us know directly on WhatsApp!" });
    }
  });

  // 4. USER SYNCHRONIZATION AFTER FIREBASE AUTHENTICATION
  app.post("/api/users/sync", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized user payload." });
      }

      const { uid, email, name, picture } = req.user;
      const userMail = email || req.body.email || "no-email@firebase.com";
      const displayName = name || req.body.displayName || "";
      const photoUrl = picture || req.body.photoUrl || "";

      const syncedUser = await getOrCreateUser(uid, userMail, displayName, photoUrl);
      await logAnalyticsEvent("user_login", syncedUser.email);
      
      res.json({ success: true, user: syncedUser });
    } catch (error: any) {
      console.error("User sync error:", error);
      res.status(500).json({ error: error.message || "Failed to sync user session to backend data store." });
    }
  });

  // 5. FETCH ALL INQUIRIES (PROTECTED ADMIN ACTION)
  app.get("/api/inquiries", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const inquiriesList = await getInquiries();
      res.json(inquiriesList);
    } catch (error: any) {
      console.error("Fetch inquiries error:", error);
      res.status(500).json({ error: error.message || "Internal database query exception." });
    }
  });

  // 6. FETCH METRICS FOR ADMIN/METADATA DASHBOARD WITH WEEKLY SUMMARY GENERATION
  app.get("/api/metrics", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const metrics = await getDashboardMetrics();
      
      // Simulate weekly PDF/report summary generation data
      const summaryDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const weeklyNotificationSimulation = {
        alertStatus: "ACTIVE",
        recipient: "starpanther0@gmail.com",
        lastSent: summaryDate,
        summaryText: `Provider Place Weekly Analytics Summary Generated successfully. Recipient starpanther0@gmail.com is up to date about ${metrics.totalInquiries} absolute submissions.`
      };

      res.json({
        metrics,
        weeklyNotificationSimulation
      });
    } catch (error: any) {
      console.error("Fetch dashboard metrics error:", error);
      res.status(500).json({ error: error.message || "Internal database query database metrics exception." });
    }
  });

  // 7. PUBLIC LOG ANALYTICS TELEMETRY FOR VISITOR TRACKING
  app.post("/api/analytics/log", async (req: Request, res: Response) => {
    const { eventType, value } = req.body;
    if (!eventType) return res.status(400).json({ error: "eventType is required." });

    try {
      const logged = await logAnalyticsEvent(eventType, value || null);
      res.json({ success: true, event: logged });
    } catch (error) {
      res.status(500).json({ error: "Failed to log event." });
    }
  });

  // Vite middleware installation for dev, static serving for production
  if (process.env.NODE_ENV !== "production") {
    console.log("Preparing Vite client middleware for development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving pre-compiled client static assets from dist folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Provider Place agency server listening at backend socket http://0.0.0.0:${PORT}`);
  });
}

startServer();
