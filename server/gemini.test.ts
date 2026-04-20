import { describe, expect, it } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("Gemini API Integration", () => {
  it("should successfully call Gemini API with valid key", async () => {
    // LLM calls can take longer, extend timeout
    const timeout = 15000;
    // Simple test to validate Gemini API key is working
    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: "Reply with exactly: GEMINI_API_KEY_VALID",
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0]).toBeDefined();
    expect(response.choices[0].message).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();
  });

  it("should handle financial analysis prompt", async () => {
    // LLM calls can take longer, extend timeout
    const timeout = 15000;
    // Test that LLM can handle financial analysis
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a financial advisor. Provide a brief financial health assessment.",
        },
        {
          role: "user",
          content: "Based on monthly income of $5000 and expenses of $3000, what is my financial health?",
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    const content = response.choices[0].message.content;
    expect(content).toBeDefined();
    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);
  }, { timeout: 15000 });
});
