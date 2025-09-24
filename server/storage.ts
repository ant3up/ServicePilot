import {
  users,
  customers,
  jobs,
  quotes,
  quoteItems,
  invoices,
  invoiceItems,
  callLogs,
  campaigns,
  aiAgentSettings,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type Job,
  type InsertJob,
  type Quote,
  type InsertQuote,
  type QuoteItem,
  type InsertQuoteItem,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem,
  type CallLog,
  type InsertCallLog,
  type Campaign,
  type InsertCampaign,
  type AiAgentSettings,
  type InsertAiAgentSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, gte, lte, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  // Job operations
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  getJobsByCustomer(customerId: string): Promise<Job[]>;
  getJobsByTechnician(technicianId: string): Promise<Job[]>;
  getJobsByDateRange(startDate: Date, endDate: Date): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: string): Promise<void>;

  // Quote operations
  getQuotes(): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote | undefined>;
  getQuotesByCustomer(customerId: string): Promise<Quote[]>;
  getQuoteItems(quoteId: string): Promise<QuoteItem[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  createQuoteItem(item: InsertQuoteItem): Promise<QuoteItem>;
  updateQuote(id: string, quote: Partial<InsertQuote>): Promise<Quote>;
  deleteQuote(id: string): Promise<void>;
  deleteQuoteItem(id: string): Promise<void>;

  // Invoice operations
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByCustomer(customerId: string): Promise<Invoice[]>;
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // Call log operations
  getCallLogs(): Promise<CallLog[]>;
  getCallLog(id: string): Promise<CallLog | undefined>;
  getCallLogsByCustomer(customerId: string): Promise<CallLog[]>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  updateCallLog(id: string, callLog: Partial<InsertCallLog>): Promise<CallLog>;

  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;

  // AI Agent operations
  getAiAgentSettings(): Promise<AiAgentSettings | undefined>;
  updateAiAgentSettings(settings: InsertAiAgentSettings): Promise<AiAgentSettings>;

  // Analytics operations
  getDashboardMetrics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Job operations
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobsByCustomer(customerId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.customerId, customerId)).orderBy(desc(jobs.createdAt));
  }

  async getJobsByTechnician(technicianId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.assignedTechnicianId, technicianId)).orderBy(desc(jobs.scheduledDate));
  }

  async getJobsByDateRange(startDate: Date, endDate: Date): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(and(gte(jobs.scheduledDate, startDate), lte(jobs.scheduledDate, endDate)))
      .orderBy(jobs.scheduledDate);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: string, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: string): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Quote operations
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async getQuotesByCustomer(customerId: string): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.customerId, customerId)).orderBy(desc(quotes.createdAt));
  }

  async getQuoteItems(quoteId: string): Promise<QuoteItem[]> {
    return await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId));
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db.insert(quotes).values(quote).returning();
    return newQuote;
  }

  async createQuoteItem(item: InsertQuoteItem): Promise<QuoteItem> {
    const [newItem] = await db.insert(quoteItems).values(item).returning();
    return newItem;
  }

  async updateQuote(id: string, quote: Partial<InsertQuote>): Promise<Quote> {
    const [updatedQuote] = await db
      .update(quotes)
      .set({ ...quote, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote;
  }

  async deleteQuote(id: string): Promise<void> {
    await db.delete(quotes).where(eq(quotes.id, id));
  }

  async deleteQuoteItem(id: string): Promise<void> {
    await db.delete(quoteItems).where(eq(quoteItems.id, id));
  }

  // Invoice operations
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.customerId, customerId)).orderBy(desc(invoices.createdAt));
  }

  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const [newItem] = await db.insert(invoiceItems).values(item).returning();
    return newItem;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Call log operations
  async getCallLogs(): Promise<CallLog[]> {
    return await db.select().from(callLogs).orderBy(desc(callLogs.createdAt));
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    const [callLog] = await db.select().from(callLogs).where(eq(callLogs.id, id));
    return callLog;
  }

  async getCallLogsByCustomer(customerId: string): Promise<CallLog[]> {
    return await db.select().from(callLogs).where(eq(callLogs.customerId, customerId)).orderBy(desc(callLogs.createdAt));
  }

  async createCallLog(callLog: InsertCallLog): Promise<CallLog> {
    const [newCallLog] = await db.insert(callLogs).values(callLog).returning();
    return newCallLog;
  }

  async updateCallLog(id: string, callLog: Partial<InsertCallLog>): Promise<CallLog> {
    const [updatedCallLog] = await db
      .update(callLogs)
      .set(callLog)
      .where(eq(callLogs.id, id))
      .returning();
    return updatedCallLog;
  }

  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // AI Agent operations
  async getAiAgentSettings(): Promise<AiAgentSettings | undefined> {
    const [settings] = await db.select().from(aiAgentSettings).limit(1);
    return settings;
  }

  async updateAiAgentSettings(settings: InsertAiAgentSettings): Promise<AiAgentSettings> {
    const existingSettings = await this.getAiAgentSettings();
    
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(aiAgentSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(aiAgentSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db.insert(aiAgentSettings).values(settings).returning();
      return newSettings;
    }
  }

  // Analytics operations
  async getDashboardMetrics(): Promise<any> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get metrics in parallel
    const [
      totalRevenue,
      activeJobs,
      pendingQuotes,
      todaysCalls,
      recentJobs,
      recentQuotes,
      recentInvoices,
      recentCallLogs
    ] = await Promise.all([
      // Total revenue from paid invoices
      db.select({ 
        total: count(invoices.id),
        revenue: invoices.total 
      })
      .from(invoices)
      .where(eq(invoices.status, "paid")),
      
      // Active jobs count
      db.select({ count: count(jobs.id) })
      .from(jobs)
      .where(or(eq(jobs.status, "scheduled"), eq(jobs.status, "in_progress"))),
      
      // Pending quotes count
      db.select({ 
        count: count(quotes.id),
        total: quotes.total 
      })
      .from(quotes)
      .where(eq(quotes.status, "sent")),
      
      // Today's calls count
      db.select({ count: count(callLogs.id) })
      .from(callLogs)
      .where(gte(callLogs.createdAt, today)),
      
      // Recent jobs
      db.select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(5),
      
      // Recent quotes
      db.select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(5),
      
      // Recent invoices
      db.select()
      .from(invoices)
      .orderBy(desc(invoices.createdAt))
      .limit(5),
      
      // Recent call logs
      db.select()
      .from(callLogs)
      .orderBy(desc(callLogs.createdAt))
      .limit(10)
    ]);

    return {
      totalRevenue: totalRevenue.reduce((sum, inv) => sum + (parseFloat(inv.revenue || "0")), 0),
      activeJobs: activeJobs[0]?.count || 0,
      pendingQuotes: pendingQuotes.length,
      pendingQuotesValue: pendingQuotes.reduce((sum, quote) => sum + (parseFloat(quote.total || "0")), 0),
      todaysCalls: todaysCalls[0]?.count || 0,
      recentActivity: {
        jobs: recentJobs,
        quotes: recentQuotes,
        invoices: recentInvoices,
        calls: recentCallLogs
      }
    };
  }
}

export const storage = new DatabaseStorage();
