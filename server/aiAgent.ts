import OpenAI from "openai";
import { storage } from "./storage";

/*
The newest OpenAI model is "gpt-5" which was released August 7, 2025. Do not change this unless explicitly requested by the user.
*/

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function handleAiCall(phoneNumber: string, transcript: string) {
  try {
    // Get AI agent settings
    const settings = await storage.getAiAgentSettings();
    const defaultGreeting = "Hello! Thank you for calling Call Mate. How can I help you today?";
    
    const systemPrompt = `You are an AI receptionist for a trades and service company called Call Mate. 
    Your role is to:
    1. Answer customer calls professionally
    2. Book appointments and schedule services
    3. Provide basic pricing information
    4. Gather customer information
    5. Handle inquiries about services
    
    Business info:
    - Greeting: ${settings?.greeting || defaultGreeting}
    - Services: ${JSON.stringify(settings?.services || ["HVAC", "Electrical", "Plumbing"])}
    - Business hours: ${JSON.stringify(settings?.businessHours || {start: "09:00", end: "17:00", days: ["mon", "tue", "wed", "thu", "fri"]})}
    
    Always be professional, helpful, and try to schedule appointments when appropriate.
    Respond with JSON containing: response (what to say), action (book_appointment|request_callback|provide_info|transfer_to_human), and any extracted customer_info.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Customer said: "${transcript}"` }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || "{}");
    
    // Log the call
    await storage.createCallLog({
      phoneNumber,
      direction: "inbound",
      transcript,
      summary: aiResponse.response,
      outcome: aiResponse.action === "book_appointment" ? "job_booked" : "no_interest",
      aiGenerated: true,
      followUpRequired: aiResponse.action === "request_callback",
      followUpNotes: aiResponse.customer_info ? JSON.stringify(aiResponse.customer_info) : undefined,
    });

    return aiResponse;
  } catch (error) {
    console.error("Error in AI call handling:", error);
    throw new Error("Failed to process AI call: " + (error as Error).message);
  }
}

export async function processCallTranscript(transcript: string) {
  try {
    const systemPrompt = `Analyze this customer service call transcript and extract key information.
    Respond with JSON containing:
    - summary: Brief summary of the call
    - outcome: One of (job_booked|quote_requested|no_interest|callback_requested|voicemail|no_answer)
    - followUpRequired: boolean
    - followUpNotes: any specific follow-up actions needed
    - customerInfo: extracted customer information if any`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw new Error("Failed to analyze transcript: " + (error as Error).message);
  }
}

export async function generateQuoteSummary(services: string[], customerInfo: any) {
  try {
    const systemPrompt = `Generate a professional quote summary for a trades/service company.
    Include estimated pricing ranges and service descriptions.
    Respond with JSON containing:
    - description: Professional description of services
    - estimatedTotal: estimated total cost
    - items: array of line items with description, quantity, rate, amount`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Services requested: ${services.join(", ")}. Customer: ${JSON.stringify(customerInfo)}` }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating quote:", error);
    throw new Error("Failed to generate quote: " + (error as Error).message);
  }
}
