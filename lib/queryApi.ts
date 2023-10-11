/**
 * Helper function.
 * Queries the OpenAI API for a chat-based completion using provided messages and configurations.
 * Always prepends a system instruction to guide the model's response.
 * Returns the model's generated message content or an error message.
 * Compatible with OpenAI API v3.2.1.
 */

import { instructions } from "@/app/helpers/constants/system-prompt";
import openai from "./chatgptConfig";

export async function query(
    outboundMessages: GPTMessage[],
    id: string,
    model: string
) {
    outboundMessages.unshift({
        role: "system",
        content: instructions,
    });

    const response = await openai
        .createChatCompletion({
            model,
            user: id,
            messages: outboundMessages,
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1000,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
            n: 1,
        })
        .then((res) => res.data.choices[0].message?.content)
        .catch((err) => `Please try again! (Error: ${err.message})`);

    return response;
}
