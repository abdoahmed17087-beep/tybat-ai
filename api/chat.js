// api/chat.js
export default async function handler(req, res) {
    // 1. التأكد أن الطلب القادم للملف هو من نوع POST فقط
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة غير مسموح بها (Method Not Allowed)' });
    }

    // 2. سحب الـ API Key من إعدادات Vercel بأمان (الاسم البرمجي هو grok)
    const apiKey = process.env.grok; 

    // التأكد من وجود المفتاح في الإعدادات لتجنب الأخطاء
    if (!apiKey) {
        return res.status(500).json({ error: 'مفتاح API غير موجود في إعدادات Vercel.' });
    }

    try {
        // 3. إرسال الطلب من سيرفر Vercel إلى سيرفر Groq
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            // نمرر البيانات القادمة من المتصفح كما هي لسيرفر Groq
            body: JSON.stringify(req.body)
        });

        // 4. استقبال الرد من Groq وإرساله مرة أخرى للمتصفح
        const data = await response.json();
        res.status(200).json(data);
        
    } catch (error) {
        // في حالة حدوث أي مشكلة في الاتصال
        res.status(500).json({ error: 'فشل الاتصال بسيرفر Groq' });
    }
}
