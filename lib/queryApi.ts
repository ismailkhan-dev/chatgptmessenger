/**
 * Helper function.
 * Queries the OpenAI API for a chat-based completion using provided messages and configurations.
 * Always prepends a system instruction to guide the model's response.
 * Returns the model's generated message content or an error message.
 * Compatible with OpenAI API v3.2.1.
 */

import openai from "./chatgptConfig";

const query = async (prompt: GPTMessage[], chatId: string, model: string) => {
    // TODO: Add instructions in a new ts file
    // prompt.unshift({
    //     role: "system",
    //     content: instructions,
    // });

    const res = await openai
        .createChatCompletion({
            model,
            user: chatId,
            messages: prompt,
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1000,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
            n: 1,
        })
        .then((res) => res.data.choices[0].message?.content)
        .catch((err) => `Please try again! (Error ${err.message}:)`);

    return res;
};

export default query;
