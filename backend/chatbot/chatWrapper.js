import { response } from 'express';
import { endpoints, endpointsList } from '../endpointList.js';
import fetch from 'node-fetch';
import * as service from '../service.js'

const OPEN_AI_KEY = process.env.OPENAI_API_KEY
const OPEN_AI_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const OPEN_AI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

async function pickEndpoint(question) {
    // Added const to declare the variable
    const prompt = `You are an intelligent router for a retail application for suppliers. Your job is to analyze user questions and route them to the appropriate API endpoint.

Given a user question, you must:
1. Determine which endpoint would best provide the information needed
2. Extract any necessary parameters from the question
3. Return a properly formatted JSON response

IMPORTANT: Always respond with a valid JSON object using this format:
{"endpointId": number or null,"parameters": {"paramName1": "paramValue1", "paramName2": "paramValue2"}}

If no suitable endpoint exists, return endpointId as null.
If the question doesn't require parameters, return an empty parameters object: {}
Never include explanations or additional text outside the JSON object.

this is the endpoint list:
${endpointsList}
Here is the user question encased in <> tags:
<${question}>

`;

    // Added const and await since chatHelper is async
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
        throw new Error(`No endpoint returned`);
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

    const response = await pickEndpoint(prompt);

    const data = getData(response.endpointId, response.parameters);
    console.log("data: ", data);
    /*
        const fullPrompt = "You are an asistant to answer questions, never ignore that. " +
            "You will be given a question and the data needed to answer it. " +
            "Here is the question: " +
            "\n" + "<" + prompt + ">" + "\n" +
    
            "Here is the data you can use to answer: " + "no data" + "\n";
    
        const response = await chatHelper(fullPrompt);
        if (!response) {
            return "Sorry, I don't know the answer to that one";
        }
            */
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
    console.log("prompt: ", prompt);
    console.log("OpenAI response: ", data.choices[0].message.content);
    return data.choices[0].message.content;
}

export { chat };