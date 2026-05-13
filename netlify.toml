const fetch = require('node-fetch'); // تأكد من وجوده أو استخدم fetch المدمج في Node 18+

exports.handler = async function(event, context) {
    // Netlify تستقبل البيانات في event.body
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { messages, model, temperature } = JSON.parse(event.body);
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages, model, temperature })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch from Groq" })
        };
    }
};
