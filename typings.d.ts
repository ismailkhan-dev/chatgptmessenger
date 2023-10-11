/**
 * `Message`: Describes the structure of a chat message in the application.
 * `GPTAgent`: Defines possible roles for chat interactions with OpenAI's GPT model.
 * `GPTMessage`: Describes the structure of a chat message for OpenAI interactions.
 * Augments the `@openai/api` module to provide type definitions for specific functions used from the module.
 */

interface Message {
    text: string;
    createdAt: admin.firestore.Timestamp;
    user: {
        _id: string | null | undefined;
        name: string | null | undefined;
        avatar: string;
    };
}

type GPTAgent = "user" | "system" | "assistant";

interface GPTMessage {
    role: GPTAgent;
    content: string;
}

declare module "@openai/api" {
    export const setApiKey: (apiKey: string) => void;
    export const createCompletion: (parameters: any) => Promise<any>;
    export const createChatCompletion: (parameters: any) => Promise<any>;
}
