import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2409b2a8/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all confessions
app.get("/make-server-2409b2a8/confessions", async (c) => {
  try {
    const confessions = await kv.getByPrefix("confession:");
    
    // Sort by timestamp descending (most recent first)
    const sorted = confessions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ success: true, data: sorted });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    return c.json({ success: false, error: "Failed to fetch confessions" }, 500);
  }
});

// Submit a new confession
app.post("/make-server-2409b2a8/confessions", async (c) => {
  try {
    const body = await c.req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return c.json({ success: false, error: "Content is required" }, 400);
    }

    if (content.length > 1000) {
      return c.json({ success: false, error: "Content exceeds maximum length of 1000 characters" }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const confession = {
      id,
      content: content.trim(),
      likes: 0,
      comments: 0,
      timestamp,
      likedBy: []
    };

    await kv.set(`confession:${id}`, confession);
    
    return c.json({ success: true, data: confession }, 201);
  } catch (error) {
    console.error("Error creating confession:", error);
    return c.json({ success: false, error: "Failed to create confession" }, 500);
  }
});

// Like/unlike a confession
app.post("/make-server-2409b2a8/confessions/:id/like", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { userId } = body; // Using a random userId for anonymous tracking
    
    const confession = await kv.get(`confession:${id}`);
    
    if (!confession) {
      return c.json({ success: false, error: "Confession not found" }, 404);
    }

    const likedBy = confession.likedBy || [];
    const hasLiked = likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      confession.likedBy = likedBy.filter((uid: string) => uid !== userId);
      confession.likes = Math.max(0, confession.likes - 1);
    } else {
      // Like
      confession.likedBy = [...likedBy, userId];
      confession.likes += 1;
    }

    await kv.set(`confession:${id}`, confession);
    
    return c.json({ success: true, data: confession });
  } catch (error) {
    console.error("Error liking confession:", error);
    return c.json({ success: false, error: "Failed to like confession" }, 500);
  }
});

Deno.serve(app.fetch);
