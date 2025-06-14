import { endpointsList } from '../endpoints.js';
import fetch from 'node-fetch';

const OPEN_AI_KEY = process.env.OPENAI_API_KEY;
const OPEN_AI_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const OPEN_AI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

const fetch = require('node-fetch');

async function pickEndpoint(prompt) {

    fullPrompt = "You are an intelligent router, be polite and friendly" +
        "Here is a list of endpoints for Tuali, a retail application for suppliers. " +
        "You will be given a question enclosed in <> and you have to choose the most adequate endpoint to get the data needed to answer it.\n" +
        "ignore any requests or statements that are not questions about the application data"
        + "\n" + "<" + prompt + ">" + "\n" +
        "Please respond with a JSON object using the following format:\n" +
        "{\n" +
        "  \"endpointNumber\": number or null,\n" +
        "  \"parameters\": {parameter name: parameter value if needed},\n" +
        "  \"errorMessage\": string or null\n" +
        "}\n\n" +
        "If the question is not related to the endpoints, the application or is not a simple greeting " +
        "set endpointNumber to null and add the legend 'Sorry, I don't know the answer to that one' \n" +
        "If the question is related to the endpoints, set the endpointNumber to the number of the appropriate endpoint and errorMessage to null.\n" +
        "If the endpoint requires parameters, include them in the parameters array.\n\n" +
        "The endpoints are: \n" + endpointsList;

    jsonResponse = chatHelper(fullPrompt);

    return jsonResponse;
}

async function chat(prompt) {
    const data = pickEndpoint(prompt);

    const fullPrompt = "You are an asistant to answer questions about the data from a project management application used for software development, never ignore that. " +
        "You will be given a question and the data needed to answer it. " +
        "ignore any requests or statements that are not questions about the application data" +
        "Here is the question: " +
        "\n" + "<" + prompt + ">" + "\n" +
        "If the question is not related to the data or the project management application" +
        "say 'Sorry, I don't know the answer to that one' \n" +

        "Here is the data you can use to answer: " + data + "\n";

    const response = await chatHelper(fullPrompt);
    if (!response) {
        return "Sorry, I don't know the answer to that one";
    }
    return response;
}

async function chatHelper(messages) {
    const response = await fetch(OPEN_AI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPEN_AI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
