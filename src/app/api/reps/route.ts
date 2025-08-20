import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Rep } from '../../../types'

export async function GET() {
  console.log('=== API Route Called ===')
  console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY)
  console.log('GOOGLE_API_KEY first 10 chars:', process.env.GOOGLE_API_KEY?.substring(0, 10))
  console.log('SHEET_ID:', process.env.SHEET_ID)

  try {
    const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_API_KEY })
    console.log('Google Sheets client created successfully')

    console.log('Attempting to fetch from sheet...')
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'House!A:K',
    })

    console.log('Response received')
    console.log('Response status:', response.status)
    console.log('Raw values:', response.data.values)
    console.log('Number of rows:', response.data.values?.length || 0)

    const rows = response.data.values || []

    if (rows.length === 0) {
      console.log('No rows found in the sheet')
      return NextResponse.json({ message: 'No data found in sheet', rows: [] })
    }

    console.log('First row (headers):', rows[0])
    console.log('Second row (first data):', rows[1])

    const reps: Rep[] = rows.slice(1).map((r, index) => {
      return {
        name: r[0] || '',
        stateDistrict: r[1] || '',
        signedCurrent: r[2]?.toLowerCase() === 'y',
        signed118th: r[3]?.toLowerCase() === 'y',
        signed117th: r[4]?.toLowerCase() === 'y',
        signed115th: r[5]?.toLowerCase() === 'y',
        legislativeContacts: r[6] || '',
        legislativeDirector: r[7] || '',
        officePhone: r[8] || '',
        senatorsSignedSenateVersion: r[10] || '',
      }
    })

    console.log('Processed reps count:', reps.length)
    console.log('First rep:', reps[141])

    return NextResponse.json(reps)
  } catch (err) {
    console.error('=== ERROR ===')
    if (err && typeof err === 'object') {
      console.error('Error type:', (err as { constructor?: { name?: string } }).constructor?.name)
      console.error('Error message:', (err as { message?: string }).message)
      console.error('Full error:', err)
      return NextResponse.json({
        error: (err as { message?: string }).message,
        type: (err as { constructor?: { name?: string } }).constructor?.name,
        details: err.toString()
      }, { status: 500 })
    } else {
      console.error('Unknown error:', err)
      return NextResponse.json({
        error: 'Unknown error',
        type: typeof err,
        details: String(err)
      }, { status: 500 })
    }
  }
}