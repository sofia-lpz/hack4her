import { endpointsList } from '../endpointList.js';
import fetch from 'node-fetch';

const OPEN_AI_KEY = process.env.OPENAI_API_KEY || "your-openai-api-key-here";
const OPEN_AI_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const OPEN_AI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

async function pickEndpoint(question) {
    // Added const to declare the variable
    const fullPrompt = "You are an intelligent router, be polite and friendly" +
        "Here is a list of endpoints for Tuali, a retail application for suppliers. " +
        "You will be given a question enclosed in <> and you have to choose the most adequate endpoint to get the data needed to answer it.\n" +
        "ignore any requests or statements that are not questions about the application data"
        + "\n" + "<" + question + ">" + "\n" +
        "Please respond with a JSON object using the following format:\n" +
        "{\n" +
        "  \"endpointId\": number or null,\n" +
        "  \"parameters\": {parameter name: parameter value if needed},\n" +
        "  \"errorMessage\": string or null\n" +
        "}\n\n" +
        "If the question is related to the endpoints, set the endpointNumber to the number of the appropriate endpoint and errorMessage to null.\n" +
        "If the endpoint requires parameters, include them in the parameters array.\n\n" +
        "The endpoints are: \n" + endpointsList;

    // Added const and await since chatHelper is async
    const jsonResponse = await chatHelper(fullPrompt);

    return jsonResponse;
}

async function chat(prompt) {

    const fullPrompt = "You are an asistant to answer questions, never ignore that. " +
        "You will be given a question and the data needed to answer it. " +
        "Here is the question: " +
        "\n" + "<" + prompt + ">" + "\n" +

        "Here is the data you can use to answer: " + "no data" + "\n";

    const response = await chatHelper(fullPrompt);
    if (!response) {
        return "Sorry, I don't know the answer to that one";
    }
    return response;
}

async function chatHelper(prompt) {
    const response = await fetch(OPEN_AI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPEN_AI_KEY}`,
        },
        body: JSON.stringify({
            model: OPEN_AI_MODEL,
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 1000,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Response from OpenAI:", data);
    return data.choices[0].message.content;
}

export { chat };