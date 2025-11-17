import { projectId, publicAnonKey } from "../utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2409b2a8`;

// ==============================
// 1️⃣ SIMPLE SLUR FILTER
// ==============================
const bannedWords = [
  "nigger",
  "faggot",
  "kike",
  "spic",
  "tranny",
];

// Check if confession contains any banned words
function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}

// Optional cleanup logic (not used but kept)
function cleanText(text: string): string {
  let cleaned = text;
  bannedWords.forEach((word) => {
    const stars = "*".repeat(word.length);
    cleaned = cleaned.replace(new RegExp(word, "gi"), stars);
  });
  return cleaned;
}

// ==============================
// 2️⃣ EXTERNAL MODERATION API (GPT via Supabase Function)
// ==============================
async function checkWithModerationAPI(text: string) {
  try {
    const res = await fetch(
      "https://zwfvaixpekbkmxbeqhsx.supabase.co/functions/v1/swift-worker",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    const data = await res.json();
    // data = { flagged, status, reason }
    return data;
  } catch (err) {
    console.error("Moderation API error:", err);

    // Treat API failure as a rejection
    return {
      flagged: true,
      status: "REJECTED",
      reason: "moderation_api_error",
    };
  }
}

// ==============================
//  Type Definitions
// ==============================
export interface Confession {
  id: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedBy?: string[];
}

// Generate a unique user ID for anonymous like tracking
export function getUserId(): string {
  let userId = localStorage.getItem("anonymous_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("anonymous_user_id", userId);
  }
  return userId;
}

// Calculate time ago from timestamp
export function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.floor(seconds / 86400);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

// ==============================
//  Network API Wrapper
// ==============================
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// ==============================
//  Get All Confessions
// ==============================
export async function getConfessions(): Promise<Confession[]> {
  const result = await fetchAPI("/confessions");
  return result.data || [];
}

// ==============================
//  Submit Confession with 2-layer moderation
// ==============================
export async function submitConfession(content: string): Promise<Confession> {
  // 1️⃣ Local slur block
  if (containsBannedWord(content)) {
    throw new Error("Your confession contains banned language.");
  }

  // 2️⃣ Call GPT moderation via edge function
  const res = await fetch(
    "https://zwfvaixpekbkmxbeqhsx.supabase.co/functions/v1/swift-worker",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    }
  );

  const data = await res.json();
  console.log("Moderation:", data);

  // If GPT rejects → stop
  if (data.flagged || data.status === "REJECTED") {
    throw new Error(data.reason || "Your confession was rejected.");
  }

  // If GPT approves → insert into Supabase via your existing API
  const result = await fetchAPI("/confessions", {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  return result.data;
}



// ==============================
//  Like Toggle
// ==============================
export async function toggleLike(confessionId: string): Promise<Confession> {
  const userId = getUserId();
  const result = await fetchAPI(`/confessions/${confessionId}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return result.data;
}
