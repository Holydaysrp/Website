export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      // CORS Preflight Handling
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(),
        });
      }
  
      // Route: GET /sensor-data
      if (url.pathname === '/sensor-data' && request.method === 'GET') {
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
  
        if (!from || !to) {
          return new Response(JSON.stringify({ error: "Missing 'from' or 'to' query parameters" }), {
            status: 400,
            headers: corsHeaders(),
          });
        }
  
        // Convert to proper SQLite timestamp format
        const fromFormatted = from.replace('T', ' ').replace('.000Z', '');
        const toFormatted = to.replace('T', ' ').replace('.000Z', '');
  
        try {
          // Query D1 Database
          const query = `
            SELECT temperature, humidity, timestamp
            FROM sensor_data
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp ASC
          `;
          const result = await env.D1_DB.prepare(query).bind(fromFormatted, toFormatted).all();
  
          return new Response(JSON.stringify(result.results), {
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Error querying D1 database:", err);
          return new Response(JSON.stringify({ error: "Failed to fetch data from D1 database" }), {
            status: 500,
            headers: corsHeaders(),
          });
        }
      }
  
      // Default Route
      return new Response("Not Found", { status: 404, headers: corsHeaders() });
    },
  };
  
  // CORS Headers Helper
  function corsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  