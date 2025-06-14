const endpoints = [
  {
    id: 1,
    name: "getCarreras",
    description: "Get list of available careers/courses",
    endpoint: "/api/carreras",
    method: "GET",
    parameters: []
  },
  {
    id: 2,
    name: "chat",
    description: "Send a message to the chatbot and get a response",
    endpoint: "/api/chat",
    method: "POST",
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: true,
        description: "The user's message to the chatbot"
      }
    ]
  }
];

const createEndpointsList = () => {
  return endpoints.map(endpoint => {
    const params = endpoint.parameters.length > 0 
      ? `Parameters: ${endpoint.parameters.map(p => `${p.name} (${p.type}${p.required ? ', required' : ''})` ).join(', ')}` 
      : 'No parameters required';
    
    return `${endpoint.id}. ${endpoint.name}: ${endpoint.description}
   Endpoint: ${endpoint.endpoint}
   Method: ${endpoint.method}
   ${params}`;
  }).join('\n\n');
};

export const endpointsList = createEndpointsList();
export default endpoints;