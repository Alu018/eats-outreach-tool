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

        const prompt = `
            You are an expert legislative outreach assistant. Your task is to lightly personalize the following outreach email for Representative ${repName}, but you must keep the topic, facts, and structure exactly as in the original. Do NOT change the subject, legislative topic, or invent new content. Only make small edits to make the email more engaging and specific to this representative, such as referencing their signing history or adding a more personal opening.

            Representative info: ${JSON.stringify(repInfo)}

            Original email:
            ${originalEmail}

            Instructions:
            - Do NOT change the topic (EATS Act and related legislation)
            - Do NOT invent new bills, acts, or unrelated content
            - Do NOT change the Quill link, contacts, or factual details
            - You may reference the representative's signing history if relevant
            - You may add a more personal touch in the opening or closing
            - Keep the professional tone and structure
            - Return only the revised email text, no commentary, no subject line

            Your output should be the original email with only minor, relevant personalization for ${repName}
        `

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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
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