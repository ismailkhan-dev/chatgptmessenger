/**
 * Defines the GET function to retrieve available models from OpenAI.
 * Transforms the list into a structured format suitable for dropdown/select UI components.
 * Returns the structured list as a JSON response with a status of 200.
 * Compatible with OpenAI API v3.2.1.
 */

import openai from "@/lib/chatgptConfig";

export async function GET() {
    const models = await openai.listModels().then((res) => res.data.data);

    const modelOptions = models.map((model) => ({
        value: model.id,
        label: model.id,
    }));

    return new Response(JSON.stringify({ modelOptions }), {
        status: 200,
    });
}
