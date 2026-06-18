import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (matching Firebase UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Inquiry / contact form submissions
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  service: text('service').notNull(),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(), // pending, in_progress, completed, rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Traffic and interactions analytics trackers
export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  eventType: text('event_type').notNull(), // page_view, cta_click, form_submit, bot_query
  value: text('value'), // context/detail
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations definitions
export const usersRelations = relations(users, ({}) => ({}));
