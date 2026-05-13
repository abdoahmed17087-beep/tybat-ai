exports.handler = async function(event, context) {
    // السماح فقط بطلبات POST
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Method Not Allowed" }) 
        };
    }

    try {
        // التحقق من وجود بيانات في الجسم (Body)
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }) };
        }

        const { messages, model, temperature } = JSON.parse(event.body);

        // التأكد من وجود مفتاح الـ API في الإعدادات
        if (!process.env.GROQ_API_KEY) {
            console.error("API Key is missing in Environment Variables");
            return { statusCode: 500, body: JSON.stringify({ error: "API Key setup missing" }) };
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || "llama-3.1-8b-instant",
                messages: messages,
                temperature: temperature || 0.3
            })
        });

        const data = await response.json();

        // إرجاع النتيجة للمتصفح
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // لحل مشاكل الـ CORS إذا وجدت
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Internal Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};
