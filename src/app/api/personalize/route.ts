import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { originalEmail, repName, repInfo } = await request.json()

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            )
        }

        const prompt = `Please personalize this outreach email for Representative ${repName}. Keep the core message and structure the same, but make it more engaging and specific to this representative. Here's the representative's information: ${JSON.stringify(repInfo)}

Original email:
${originalEmail}

Please provide a personalized version that:
1. Maintains all the key information (Quill link, contacts, etc.)
2. Adds a more personal touch in the opening
3. References their past signing history if relevant
4. Keeps the same professional tone
5. Maintains the same email structure and closing

Return only the personalized email text, no additional commentary.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        })

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`)
        }

        const data = await response.json()
        const personalizedEmail = data.candidates[0]?.content?.parts[0]?.text

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