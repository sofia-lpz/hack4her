import { response } from 'express';
import { endpoints, endpointsList } from './endpointList.js';
import fetch from 'node-fetch';
import * as service from './service.js'

const GEMINI_API_KEY = "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

const today = new Date();
const currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
const currentTime = today.toTimeString().split(' ')[0]; // Format: HH:MM:SS

async function pickEndpoint(question) {
    const prompt = `
    
You are an intelligent router for a retail application for suppliers. Your job is to analyze user questions and route them to the appropriate API endpoint.

Today is ${currentDate} and the current time is ${currentTime}.

Given a user question, you must:
1. Determine which endpoint would best provide the information needed
2. Extract any necessary parameters from the question
3. Return a properly formatted JSON response

IMPORTANT FORMATTING INSTRUCTIONS:
- Return ONLY the raw JSON object with no explanation, no code blocks, no backticks
- Do not add markdown anywhere
- Do not add any headers like "Response:" or "JSON:"
- Return strictly the raw JSON text and nothing else
- Your entire response must be valid JSON that can be directly parsed

Use this format:
{"endpointId": number or null,"parameters": {"paramName1": "paramValue1", "paramName2": "paramValue2"}}

If no suitable endpoint exists, return endpointId as null.
If the question doesn't require parameters, return an empty parameters object: {}

this is the endpoint list:
${endpointsList}
Here is the user question encased in <> tags:
<${question}>

`;
    const jsonResponse = await chatHelper(prompt);

    try {
        return JSON.parse(jsonResponse);
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Raw response:", jsonResponse);
        return { endpointId: null, parameters: {} };
    }
}

async function getData(endpointId, parameters) {
    const endpoint = endpoints.find(e => e.id === endpointId);

    if (!endpoint) {
        return "No data needed"
    }

    switch (endpointId) {
        case 1: // users
            return await service.getUsers(parameters);
        case 2: // stores
            return await service.getStores(parameters);
        case 3: // feedback
            return await service.getFeedback(parameters);
        case 4: // citas
            return await service.getCitas(parameters);
        default:
            throw new Error(`Endpoint with ID ${endpointId} not implemented`);
    }
}

async function chat(prompt) {

    const endpointResponse = await pickEndpoint(prompt);

    const data = await getData(endpointResponse.endpointId, endpointResponse.parameters);

        const fullPrompt = "You are an asistant to answer questions, never ignore that. " +
        "Today is " + currentDate + " and the current time is " + currentTime + ". " +
        "You are an expert in retail and you have access to a set of APIs that provide information about users, stores, feedback, and appointments. " +

            "You will be given a question and the data needed to answer it. " +
            "Do not answer any question or request that is not related to retail. Never return artistic content even if requested. DO NOT ADD MARKDOWN. " +
            "Here is the question: " +
            "\n" + "<" + prompt + ">" + "\n" +
    
        "Here is the data you can use to answer: " + JSON.stringify(data, null, 2) + "\n";
    
        const response = await chatHelper(fullPrompt);
        if (!response) {
            return "Sorry, I don't know the answer to that one";
        }
            
    return response;
}

async function summarizeFeedback(feedback, store_name) {
    const prompt = `
You are an expert in summarizing customer feedback for retail stores. Your task is to analyze the provided feedback and generate a concise summary that highlights key themes, sentiments, and any actionable insights.
The summary should be in the format of three clear, brief sentences, do not add formatting or bullet points, just plain text.
The feedback for ${store_name} is as follows:
${JSON.stringify(feedback, null, 2)}
`;
    const response = await chatHelper(prompt);
    return response;
}

async function chatHelper(prompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            }
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("prompt: ", prompt);
    
    // Extract response from Gemini API format
    const responseText = data.candidates[0].content.parts[0].text;
    console.log("Gemini response: ", responseText);
    return responseText;
}

export { chat, summarizeFeedback};