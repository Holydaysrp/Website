function corsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  
  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      // Handle CORS Preflight Requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(),
        });
      }
  
      // Route: POST /register
      if (url.pathname === '/register' && request.method === 'POST') {
        try {
          const { email } = await request.json();
          const password = generatePassword(12);
  
          // Save user in KV store
          await env.USER_AUTH.put(`user:${email}`, JSON.stringify({
            password,
            verified: false,
          }));
  
          const token = generateToken();
          const confirmLink = `workers.dev/confirm?token=${token}`;
          await env.USER_AUTH.put(`token:${token}`, JSON.stringify({ email, expires: Date.now() + 86400000 }));
  
          // Send confirmation email using Resend API
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'Viacheslav Demushkin <noreply@viaches.dev>',
              to: [email],
              subject: "Confirm Your Email",
              html: `<p>Please confirm your account by clicking <a href="${confirmLink}">here</a>.</p>`,
            }),
          });
  
          if (!emailResponse.ok) {
            const errorDetails = await emailResponse.text();
            console.error(`Failed to send email: ${errorDetails}`);
            return new Response(JSON.stringify({
              error: `Failed to send confirmation email: ${errorDetails}`,
            }), { status: 500, headers: corsHeaders() });
          }
  
          // Success response
          return new Response(JSON.stringify({
            message: "Registration successful. Check your email for confirmation.",
            password,
          }), { headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  
        } catch (err) {
          console.error(`Error in /register: ${err}`);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        }
      }
  
      // Route: POST /login
      if (url.pathname === '/login' && request.method === 'POST') {
        try {
          const { email, password } = await request.json();
          const userData = await env.USER_AUTH.get(`user:${email}`, { type: "json" });
  
          if (!userData) throw new Error("User not found.");
          if (!userData.verified) throw new Error("Email not verified.");
          if (userData.password !== password) throw new Error("Invalid credentials.");
  
          return new Response(JSON.stringify({ message: "Login successful" }), {
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        }
      }
  
      // Route: GET /confirm
      if (url.pathname === '/confirm' && request.method === 'GET') {
        const token = url.searchParams.get('token');
        if (!token) return new Response("Invalid token.", { status: 400, headers: corsHeaders() });
  
        const tokenData = await env.USER_AUTH.get(`token:${token}`, { type: "json" });
        if (!tokenData || Date.now() > tokenData.expires) {
          return new Response("Token expired or invalid.", { status: 400, headers: corsHeaders() });
        }
  
        const userData = await env.USER_AUTH.get(`user:${tokenData.email}`, { type: "json" });
        if (!userData) return new Response("User not found.", { status: 404, headers: corsHeaders() });
  
        // Mark email as verified
        userData.verified = true;
        await env.USER_AUTH.put(`user:${tokenData.email}`, JSON.stringify(userData));
        await env.USER_AUTH.delete(`token:${token}`); // Clean up token
  
        return new Response("Your email has been verified! You can now log in.", {
          status: 200,
          headers: { ...corsHeaders(), "Content-Type": "text/html" },
        });
      }
  
      // Default response for unmatched routes
      return new Response("Not Found", { status: 404, headers: corsHeaders() });
    },
  };
  
  // Helper functions
  function generatePassword(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  }
  
  function generateToken(length = 32) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  }
  
