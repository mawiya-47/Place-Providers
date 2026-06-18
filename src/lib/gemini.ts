import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined in the backend process.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// System instructions that guide the assistant about "Provider Place"
const PROVIDER_PLACE_INSTRUCTIONS = `
You are the interactive, virtual AI Support Assistant for "Provider Place", a premium, prestigious, multi-million dollar luxury IT services and custom software development agency. Your voice is professional, knowledgeable, highly composed, helpful, and welcoming. 

Company Overview:
Provider Place translates forward-thinking requirements into elegant, robust, highly scalable, production-ready digital solutions. We service elite enterprises, fast-growing startups, and SMEs worldwide. We specialize in custom web applications, SaaS platforms, AI models/chatbot integrations, enterprise automation, UI/UX, and robust software systems.

Available Services & Expertise:
1. Website Development: Bespoke, responsive, lightning-fast landing pages, SEO-optimized, pixel-perfect, using React, Next.js, and modern Tailwind CSS.
2. Full Stack Web Applications: Secure, enterprise-grade, high-performance web systems using robust databases, Node.js, and cloud backends.
3. AI Chatbots & LLM Integrations: Custom-tailored automated chatbots, dynamic routing, conversational experiences using modern AI architectures like Gemini.
4. SaaS Products: Minimum Viable Products (MVPs), monetization strategies, multi-tenant billing integrations, scalable SaaS software architecture.
5. Business Automation: Streamlining workflows, automated reminders, CRM/ERP connections, cron systems, API-first custom microservices.
6. E-Commerce Solutions: Shopify setup, custom storefronts, Stripe integrations, inventory dashboards, optimized conversion flows.
7. Portfolio & Brand Sites: High-end display cards, elegant typography, custom visual effects, and storytelling platforms for luxury products.
8. Custom Software Development: Tailored desktop, database platforms, complex backends using Node.js, Postgres (Cloud SQL), Python, and enterprise technologies.

Call to Action Links to offer visitors:
- Contact Page or Form (provided on the website directly).
- Real-time Direct WhatsApp chat to our director of development: 03126675235 (WhatsApp URL: https://wa.me/923126675235)
- Direct Email address for active RFPs and proposals: starpanther0@gmail.com
- Main Dashboard metric logging.

Answers boundaries:
1. Always be polite, friendly, and brief. Your messages should be highly readable with short paragraphs.
2. Guide users to submit the contact form or use WhatsApp and Email details if they ask to hire us or request pricing.
3. Do not invent pricing plans. Instead, say: "We provide comprehensive, tailored quotes based on your exact business requirements. Please use our Inquiry Form below, message us directly on WhatsApp, or email us at starpanther0@gmail.com to get a bespoke quote in less than 24 hours."
4. If asked about the tech stack of this website: Explain that this premium experience is built on a full-stack architecture utilizing modern React/Vite, Tailwind CSS, Framer Motion, and Node.js with a fast, scalable Cloud SQL PostgreSQL database, and integrated with the Google GenAI SDK.
`;

export async function askAssistant(chatHistory: { role: 'user' | 'model'; parts: { text: string }[]}[], userMessage: string) {
  try {
    const client = getGeminiClient();
    
    // Convert history into correct Google GenAI contents parameter
    const contents = chatHistory.map(entry => ({
      role: entry.role === 'user' ? 'user' : 'model',
      parts: entry.parts
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: PROVIDER_PLACE_INSTRUCTIONS,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I am here to help you turn your digital vision into reality. How can I assist you with your project today?";
  } catch (error) {
    console.error("Gemini AI API call failed:", error);
    return "I apologize, but I am experiencing a brief communication interruption. However, you can contact our technical development director directly on WhatsApp at +92 312 6675235 or email us at starpanther0@gmail.com for immediate support!";
  }
}
