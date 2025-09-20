import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { originalEmail, repName, repInfo } = await request.json()

        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        const prompt = `
TASK: Lightly personalize the email below for Representative ${repName}. You MUST preserve all original content and only make minor adjustments.

ORIGINAL EMAIL (DO NOT CHANGE THE CORE CONTENT):
${originalEmail}

REPRESENTATIVE INFO: ${JSON.stringify(repInfo)}

FORBIDDEN CHANGES:
- DO NOT change the email greeting
- Do NOT change the topic (agricultural standards/state rights)
- Do NOT change any bill names, contact information, or facts
- Do NOT add new legislation or unrelated content
- Do NOT change the main body paragraphs substantially
- DO NOT change the greeting names to the Representative's name

Here is an example output of a lightly personalized email:
Hi [Legislative Contact's Name],

Thank you for your consistent support of efforts to promote a safe and sustainable food system.

I'm reaching out to see if Rep. Shomari Figures would consider signing onto a letter currently circulating in the House, which is being led by Reps. Simon, Costa, and McGovern. The letter urges the House Agriculture Committee to reject any provision that would override state-level standards for certain agricultural products. This letter currently has over 160 signatures from House Democrats, and is gaining more support daily.

These letters oppose what was once known as the "Steve King Amendment," later rebranded as the "EATS Act," though the intent remains the same—stripping states of their right to protect animals, farmers, and consumers.

For any questions or to add your boss's name, you can reach out to Sydney Dahiyat in Rep. Simon's office (Sydney.Dahiyat@mail.house.gov) or John Swords in Rep. McGovern's office (John.Swords@mail.house.gov).

Thanks again for your leadership on this issue, and for considering this latest request.

Best,
[Your Name]
`;

        // const prompt = `Please personalize this outreach email for Representative ${repName}. Keep the core message and structure the same, but make it more engaging and specific to this representative.

        // Here's the representative's information: ${JSON.stringify(repInfo)}
        // And here is the original email. Do NOT change up the original email too much at all:
        // ${originalEmail}

        // Please provide a personalized version that:
        // 1. Maintains all the key information (Quill link, contacts, etc.)
        // 2. Adds a more personal touch in the opening
        // 3. References their past signing history if relevant
        // 4. Keeps the same professional tone
        // 5. Maintains the same email structure and closing

        // Return only the personalized email text, no additional commentary.`

        // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         contents: [{
        //             parts: [{
        //                 text: prompt
        //             }]
        //         }],
        //         generationConfig: {
        //             temperature: 0.7,
        //             topK: 40,
        //             topP: 0.95,
        //             maxOutputTokens: 2048,
        //         }
        //     })
        // })
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are an expert legislative outreach assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2048,
                temperature: 0.1,
                top_p: 0.1,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`)
        }

        // const data = await response.json()
        // const personalizedEmail = data.candidates[0]?.content?.parts[0]?.text
        const data = await response.json()
        const personalizedEmail = data.choices?.[0]?.message?.content

        if (!personalizedEmail) {
            throw new Error('No content generated from Gemini API')
        }

        return NextResponse.json({ personalizedEmail })

    } catch (error) {
        console.error('Error personalizing email:', error)
        return NextResponse.json(
            { error: 'Failed to personalize email' },
            { status: 500 }
        )
    }
}