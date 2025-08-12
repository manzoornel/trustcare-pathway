import { Message } from "@/components/chat/types";
import { qaData, QAItem } from "./chatQAData";

interface AiResponseGeneratorOptions {
  conversationContext: string[];
}

export class AiResponseGenerator {
  private extractTopics(context: string[]): Set<string> {
    const recentTopics = new Set<string>();

    context.forEach((item) => {
      if (item.startsWith("User:")) {
        const userMsg = item.substring(6).toLowerCase();
        if (userMsg.includes("appointment")) recentTopics.add("appointment");
        if (userMsg.includes("hour") || userMsg.includes("open"))
          recentTopics.add("hours");
        if (userMsg.includes("location") || userMsg.includes("address"))
          recentTopics.add("location");
        if (userMsg.includes("service") || userMsg.includes("treat"))
          recentTopics.add("services");
        if (userMsg.includes("insurance")) recentTopics.add("insurance");
        if (userMsg.includes("covid") || userMsg.includes("vaccine"))
          recentTopics.add("covid");
        if (userMsg.includes("doctor") || userMsg.includes("physician"))
          recentTopics.add("doctors");
        if (userMsg.includes("emergency")) recentTopics.add("emergency");
        if (userMsg.includes("lab") || userMsg.includes("test"))
          recentTopics.add("lab");
        if (userMsg.includes("medicine") || userMsg.includes("medication"))
          recentTopics.add("medication");
        if (userMsg.includes("symptom") || userMsg.includes("pain"))
          recentTopics.add("symptoms");
        if (userMsg.includes("diet") || userMsg.includes("nutrition"))
          recentTopics.add("diet");
        if (userMsg.includes("diabetes") || userMsg.includes("blood pressure"))
          recentTopics.add("conditions");
      }
    });

    return recentTopics;
  }

  private extractUserName(context: string[]): string {
    let userName = "";

    context.forEach((item) => {
      if (item.startsWith("User:")) {
        const userMsg = item.substring(6).toLowerCase();
        if (
          userMsg.includes("my name is") ||
          userMsg.includes("i'm ") ||
          userMsg.includes("i am ")
        ) {
          const nameMatch = userMsg.match(
            /my name is (\w+)|i'?m (\w+)|i am (\w+)/i
          );
          if (nameMatch) {
            const capturedName = nameMatch[1] || nameMatch[2] || nameMatch[3];
            if (capturedName && capturedName.length > 2) {
              // Avoid capturing "I'm a" etc.
              userName =
                capturedName.charAt(0).toUpperCase() + capturedName.slice(1);
            }
          }
        }
      }
    });

    return userName;
  }

  private isFollowUpQuestion(
    context: string[],
    userInputLower: string
  ): boolean {
    return (
      context.length > 2 &&
      (userInputLower.includes("what about") ||
        userInputLower.includes("how about") ||
        userInputLower.includes("and") ||
        userInputLower.includes("also") ||
        userInputLower.includes("?") ||
        userInputLower.length < 15) // Short questions are often follow-ups
    );
  }

  private findBestMatchFromQA(userInput: string): QAItem | null {
    const userInputLower = userInput.toLowerCase();

    // First, try to find an exact match
    for (const category of qaData) {
      for (const item of category.questions) {
        if (userInputLower.includes(item.question.toLowerCase())) {
          return item;
        }
      }
    }

    // If no exact match, try keyword matching
    let bestMatch: QAItem | null = null;
    let highestMatchScore = 0;

    // Split user input into keywords
    const userKeywords = userInputLower
      .replace(/[.,?!;:]/g, "")
      .split(" ")
      .filter((word) => word.length > 2);

    for (const category of qaData) {
      for (const item of category.questions) {
        const questionLower = item.question.toLowerCase();
        let matchScore = 0;

        // Count matching keywords
        userKeywords.forEach((keyword) => {
          if (questionLower.includes(keyword)) {
            matchScore++;
          }
        });

        // If this is a better match, update
        if (matchScore > highestMatchScore) {
          highestMatchScore = matchScore;
          bestMatch = item;
        }
      }
    }

    // Only return if we have a decent match
    return highestMatchScore >= 2 ? bestMatch : null;
  }

  public generateResponse(
    userInput: string,
    options: AiResponseGeneratorOptions
  ): string {
    const { conversationContext } = options;
    const userInputLower = userInput.toLowerCase();

    // Check for Q&A match first
    const qaMatch = this.findBestMatchFromQA(userInput);
    if (qaMatch) {
      return qaMatch.answer;
    }

    // If no direct match in Q&A data, use original logic
    let botResponse =
      "I'm sorry, I don't have enough information to answer that. Could you provide more details?";

    // Check if this is a follow-up question
    const isFollowUp = this.isFollowUpQuestion(
      conversationContext,
      userInputLower
    );

    // Extract topics from conversation context
    const recentTopics = this.extractTopics(conversationContext);

    // Base responses for different topics
    if (
      userInputLower.includes("appointment") ||
      userInputLower.includes("book") ||
      userInputLower.includes("schedule")
    ) {
      botResponse =
        "To book an appointment, you can visit our appointments page or call us at (555) 123-4567. Would you like me to redirect you to the appointments page?";

      // If this is a follow-up about appointments
      if (recentTopics.has("appointment") && isFollowUp) {
        botResponse =
          "For your appointment, you'll need your insurance card and ID. Our online appointment system also lets you select your preferred doctor if they have availability.";
      }
    } else if (
      userInputLower.includes("hour") ||
      userInputLower.includes("open")
    ) {
      botResponse =
        "Our clinic operates 24/7. You can visit anytime for consultations, lab tests, and pharmacy services.";

      // If this is a follow-up about hours
      if (recentTopics.has("hours") && isFollowUp) {
        botResponse =
          "For urgent care needs outside our regular hours, we have an after-hours phone service at (555) 987-6543. Emergency cases should always go to the nearest ER.";
      }
    } else if (
      userInputLower.includes("location") ||
      userInputLower.includes("address") ||
      userInputLower.includes("where")
    ) {
      botResponse =
        "Our clinic is located at 123 Health Avenue, Medical District, Your City. You can find directions on our Contact page.";

      // If this is a follow-up about location
      if (recentTopics.has("location") && isFollowUp) {
        botResponse =
          "We have ample parking available onsite, and we're also accessible by public transport. Bus routes 10 and 15 stop right in front of our building.";
      }
    } else if (
      userInputLower.includes("service") ||
      userInputLower.includes("treat") ||
      userInputLower.includes("specialize")
    ) {
      botResponse =
        "We offer a wide range of services including preventive care, chronic disease management, pediatrics, women's health, and more. You can check our Services page for a complete list.";

      // If this is a follow-up about services
      if (recentTopics.has("services") && isFollowUp) {
        botResponse =
          "Our most requested services include annual physicals, vaccinations, and chronic disease management. We also provide telehealth consultations for qualified cases.";
      }
    } else if (userInputLower.includes("insurance")) {
      botResponse =
        "We accept most major insurance plans including BlueCross, Aetna, Cigna, and Medicare. Please contact our office for specific information about your insurance coverage.";

      // If this is a follow-up about insurance
      if (recentTopics.has("insurance") && isFollowUp) {
        botResponse =
          "For insurance verification, please bring your card to your appointment. We also offer payment plans for those with high deductibles or without insurance coverage.";
      }
    } else if (
      userInputLower.includes("covid") ||
      userInputLower.includes("vaccine") ||
      userInputLower.includes("vaccination")
    ) {
      botResponse =
        "We offer COVID-19 testing and vaccinations. Please call our office to schedule an appointment for either service.";

      // If this is a follow-up about COVID
      if (recentTopics.has("covid") && isFollowUp) {
        botResponse =
          "We provide both rapid antigen and PCR tests. COVID vaccination appointments are available Monday through Friday, and no referral is needed.";
      }
    } else if (
      userInputLower.includes("doctor") ||
      userInputLower.includes("physician") ||
      userInputLower.includes("specialist")
    ) {
      botResponse =
        "Our clinic has several experienced doctors specializing in different areas of medicine. You can view their profiles on our About page.";

      // If this is a follow-up about doctors
      if (recentTopics.has("doctors") && isFollowUp) {
        botResponse =
          "Our medical team includes family physicians, pediatricians, and specialists in internal medicine. Dr. Sarah Chen and Dr. Michael Rodriguez are currently accepting new patients.";
      }
    } else if (userInputLower.includes("emergency")) {
      botResponse =
        "If you're experiencing a medical emergency, please call 911 immediately. For urgent but non-emergency issues, you can call our after-hours line at (555) 987-6543.";

      // If this is a follow-up about emergency
      if (recentTopics.has("emergency") && isFollowUp) {
        botResponse =
          "We have an urgent care clinic that handles non-life-threatening emergencies during business hours. For serious conditions like chest pain or severe bleeding, please go to the ER.";
      }
    } else if (
      userInputLower.includes("hi") ||
      userInputLower.includes("hello") ||
      userInputLower.includes("hey")
    ) {
      botResponse =
        "Hello! How can I assist you with your healthcare needs today?";
    } else if (userInputLower.includes("thank")) {
      botResponse =
        "You're welcome! Is there anything else I can help you with?";
    } else if (
      userInputLower.includes("bye") ||
      userInputLower.includes("goodbye")
    ) {
      botResponse =
        "Thank you for chatting with me. If you have more questions later, feel free to come back. Take care!";
    }

    // Extract user name from the conversation
    const userName = this.extractUserName(conversationContext);

    // Personalize response if we know the user's name
    if (
      userName &&
      !userInputLower.includes("bye") &&
      !userInputLower.includes("thank")
    ) {
      botResponse = `${botResponse} ${
        Math.random() > 0.5
          ? `Is there anything else I can help you with today, ${userName}?`
          : ""
      }`;
    }

    return botResponse;
  }
}

export const aiResponseGenerator = new AiResponseGenerator();
