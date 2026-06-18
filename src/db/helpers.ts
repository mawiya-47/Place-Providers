import { db } from './index.ts';
import { users, inquiries, analytics } from './schema.ts';
import { eq, sql } from 'drizzle-orm';

// Synchronize or create a user profile in Postgres
export async function getOrCreateUser(uid: string, email: string, displayName?: string | null, photoUrl?: string | null) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user setup failed:", error);
    throw new Error("Failed to register or select user.", { cause: error });
  }
}

// Register a new inquiry from the contact form
export async function createInquiry(name: string, email: string, phone: string | null, service: string, message: string) {
  try {
    const result = await db.insert(inquiries)
      .values({
        name,
        email,
        phone,
        service,
        message,
        status: 'pending',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database inquiry creation failed:", error);
    throw new Error("Failed to save your inquiry. Please try again later.", { cause: error });
  }
}

// Fetch all inquiries sorted by date for admin dashboard
export async function getInquiries() {
  try {
    const result = await db.select()
      .from(inquiries)
      .orderBy(sql`${inquiries.createdAt} DESC`);
    return result;
  } catch (error) {
    console.error("Database fetch inquiries failed:", error);
    throw new Error("Failed to retrieve inquiries.", { cause: error });
  }
}

// Log an analytics event (for counters / metrics)
export async function logAnalyticsEvent(eventType: string, value?: string | null) {
  try {
    const result = await db.insert(analytics)
      .values({
        eventType,
        value: value || null,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database analytics logging failed:", error);
    // Silent fail so we don't crash the main request threads on telemetry glitches
    return null;
  }
}

// Get analytics summaries / metrics for the dashboard
export async function getDashboardMetrics() {
  try {
    // 1. Total inquiries count
    const totalInquiriesRecord = await db.select({ count: sql<number>`count(*)::int` }).from(inquiries);
    const totalInquiries = totalInquiriesRecord[0]?.count || 0;

    // 2. Pending, Completed, In-progress breakdown
    const statusBreakdown = await db.select({
      status: inquiries.status,
      count: sql<number>`count(*)::int`
    }).from(inquiries).groupBy(inquiries.status);

    // 3. Service breakdown
    const serviceBreakdown = await db.select({
      service: inquiries.service,
      count: sql<number>`count(*)::int`
    }).from(inquiries).groupBy(inquiries.service);

    // 4. Monthly/daily trends of inquiries
    const trendBreakdown = await db.select({
      dateStr: sql<string>`DATE(created_at)::text`,
      count: sql<number>`count(*)::int`
    }).from(inquiries)
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at) ASC`);

    // 5. Total traffic events by interaction type
    const interactionEvents = await db.select({
      eventType: analytics.eventType,
      count: sql<number>`count(*)::int`
    }).from(analytics).groupBy(analytics.eventType);

    return {
      totalInquiries,
      statusBreakdown,
      serviceBreakdown,
      trendBreakdown,
      interactionEvents,
    };
  } catch (error) {
    console.error("Database dashboard metrics fetch failed:", error);
    throw new Error("Failed to load dashboard metrics.", { cause: error });
  }
}
