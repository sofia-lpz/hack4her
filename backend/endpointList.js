const endpoints = [
  {
    id: 1,
    name: "users",
    description: "Get user information with optional filtering",
    column: [
      { name: "id", type: "number" },
      { name: "username", type: "string" },
      { name: "first_name", type: "string" },
      { name: "last_name", type: "string" },
      { name: "email", type: "string" },
      { name: "role", type: "string" }
    ]
  },
  {
    id: 2,
    name: "stores",
    description: "Get store information with optional filtering",
    column: [
      { name: "id", type: "number" },
      { name: "longitude", type: "decimal" },
      { name: "latitude", type: "decimal" },
      { name: "nombre", type: "string" },
      { name: "nps", type: "decimal" },
      { name: "fillfoundrate", type: "decimal" },
      { name: "damage_rate", type: "decimal" },
      { name: "out_of_stock", type: "decimal" },
      { name: "complaint_resolution_time_hrs", type: "decimal" }
    ]
  },
  {
    id: 3,
    name: "feedback",
    description: "Get feedback with optional filtering",
    column: [
      { name: "id", type: "number" },
      { name: "user_id", type: "number" },
      { name: "store_id", type: "number" },
      { name: "comment", type: "string" },
      { name: "created_at", type: "timestamp" },
    ]
  },
  {
    id: 4,
    name: "citas",
    description: "Get appointment information with optional filtering",
    column: [
      { name: "id", type: "number" },
      { name: "store_id", type: "number" },
      { name: "date", type: "date" },
      { name: "time", type: "time" },
      { name: "confirmed", type: "boolean" },
      { name: "cancelled", type: "boolean" }
    ]
  }
];

const createEndpointsList = () => {
  return endpoints.map(endpoint => {
    let params = "No parameters required";
    
    if (endpoint.column.length > 0) {
      const paramDetails = endpoint.column.map(p => {
        return `${p.name} (${p.type})`;
      }).join('\n   - ');
      
      params = `Columns:\n   - ${paramDetails}`;
    }
    
    return `${endpoint.id}. ${endpoint.name}: ${endpoint.description}
   ${params}`;
  }).join('\n\n');
};

// Add explanation of filter parameters
const filterExplanation = `
Filter columns can be used with the following syntax:
- column=eq.value    # Equal to
- column=gt.value    # Greater than
- column=gte.value   # Greater than or equal
- column=lt.value    # Less than
- column=lte.value   # Less than or equal
- column=neq.value   # Not equal
- column=like.pattern # Case-sensitive pattern matching
- column=ilike.pattern # Case-insensitive pattern matching
`;

// Fix the exports
export const endpointsList = createEndpointsList();
export const parameters = filterExplanation;

// Export as default object for compatibility
export default { endpointsList };

export { endpoints };