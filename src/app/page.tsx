'use client'
import { useEffect, useState } from 'react'
import StateFilter from '../components/StateFilter'
import RepList from '../components/RepList'
import { Rep } from '../types'

const Home: React.FC = () => {
  const [reps, setReps] = useState<Rep[]>([])
  const [stateFilter, setStateFilter] = useState('')
  const [states, setStates] = useState<string[]>([])
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null)
  const [orgName, setOrgName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // EMAIL
  const [personalizedEmail, setPersonalizedEmail] = useState('')
  const [isPersonalizing, setIsPersonalizing] = useState(false)
  const [usePersonalized, setUsePersonalized] = useState(false)
  const [editableEmail, setEditableEmail] = useState('')
  const [hasManualEdit, setHasManualEdit] = useState(false)

  // search
  const [repSearch, setRepSearch] = useState('')

  // alert
  useEffect(() => {
    if (!localStorage.getItem('eatsOutreachAlertShown')) {
      alert('Important: Please check the caveats listed below before using this tool!');
      localStorage.setItem('eatsOutreachAlertShown', 'true');
    }
  }, []);

  useEffect(() => {
    if (selectedRep) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [selectedRep])

  useEffect(() => {
    if (selectedRep) {
      const generated = generateEmailBody(selectedRep)
      if (!hasManualEdit || editableEmail === '' || editableEmail === generated) {
        setEditableEmail(generated)
        setHasManualEdit(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgName, selectedRep])

  // When user types in textarea, mark as manual edit
  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableEmail(e.target.value)
    setHasManualEdit(true)
  }

  const quillLink = `None`;
  const letter115 = `https://www.foodsolutionsaction.org/may2018115th`;
  const letter117 = `https://schrier.house.gov/sites/evo-subsites/schrier.house.gov/files/evo-media-document/Prop%2012%20Letter%20FINAL.pdf?utm_source=chatgpt.com`;
  const letter118 = `https://animalwellnessaction.org/wp-content/uploads/2023/08/Anti-EATS-Act-House-letter-171-signers.pdf`;
  const senateLetter = `https://www.padilla.senate.gov/newsroom/press-releases/padilla-schiff-booker-markey-lead-28-senate-colleagues-in-effort-to-protect-californias-proposition-12/`;

  const fullLetterText = `none`

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetch('/api/reps')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`)
        }
        return res.json()
      })
      .then((data: Rep[]) => {
        setReps(data)
        // Extract state from stateDistrict - handle both "CA-01" and "CA01" formats
        const stateSet = new Set(
          data.map(r => {
            const stateDistrict = r.stateDistrict
            // Extract just the letters (state code) from the beginning
            const stateMatch = stateDistrict.match(/^([A-Z]{2})/i)
            return stateMatch ? stateMatch[1].toUpperCase() : null
          }).filter(Boolean)
        )
        setStates(Array.from(stateSet).filter((s): s is string => s !== null).sort())
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching reps:', err)
        setError('Failed to load representative data. Please try refreshing the page.')
        setIsLoading(false)
      })
  }, [])

  const filteredReps = reps.filter(r => {
    // State filter
    const stateMatch = r.stateDistrict.match(/^([A-Z]{2})/i)
    const repState = stateMatch ? stateMatch[1].toUpperCase() : ''
    const stateOk = stateFilter ? repState === stateFilter : true

    // Name search (case-insensitive, partial match)
    const nameOk = repSearch
      ? r.name.toLowerCase().includes(repSearch.trim().toLowerCase())
      : true

    return stateOk && nameOk
  })

  // Helper function to extract first names from emails
  const getFirstNamesFromEmails = (emailString: string) => {
    if (!emailString) return ''

    // Split by newlines and clean up any extra whitespace
    const emails = emailString.split('\n').map(email => email.trim()).filter(email => email)

    const firstNames = emails.map(email => {
      if (!email.includes('@')) return '' // Skip if not an email

      // Extract the part before @ and before any dots or underscores
      const beforeAt = email.split('@')[0]
      const firstName = beforeAt.split('.')[0].split('_')[0]
      // Capitalize first letter
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    }).filter(name => name) // Remove empty names

    // Join names properly
    if (firstNames.length === 0) return ''
    if (firstNames.length === 1) return firstNames[0]
    if (firstNames.length === 2) return `${firstNames[0]} and ${firstNames[1]}`

    // For 3+ names: "John, Jane, and Bob"
    const lastIndex = firstNames.length - 1
    return `${firstNames.slice(0, lastIndex).join(', ')}, and ${firstNames[lastIndex]}`
  }

  const generateEmailBody = (rep: Rep) => {
    // Build previous letter info
    const signedLetters: { year: string, url: string }[] = []
    if (rep.signed115th) signedLetters.push({ year: '115th', url: letter115 })
    if (rep.signed117th) signedLetters.push({ year: '117th', url: letter117 })
    if (rep.signed118th) signedLetters.push({ year: '118th', url: letter118 })

    let signingSentence = ''
    if (signedLetters.length > 0) {
      const countWord = ['one', 'two', 'three'][signedLetters.length - 1] || signedLetters.length
      const letterList = signedLetters
        .map((l) => `${l.year}`)
        .join(', ')
        .replace(/, ([^,]*)$/, ', and $1')
      signingSentence = `Rep. ${rep.name} has been a strong voice on this issue, having signed ${countWord} previous letter${signedLetters.length > 1 ? 's' : ''} in the ${letterList} Congress${signedLetters.length > 1 ? 'es' : ''}. The most recent one was signed by over 170 House Democrats.`
    } else {
      signingSentence = 'In 2023, over 170 House Democrats signed a similar opposition letter.'
    }

    // Senator sentence
    let senatorSentence = ''
    const senatorValue = rep.senatorsSignedSenateVersion?.trim().toLowerCase()
    if (
      rep.senatorsSignedSenateVersion &&
      senatorValue !== 'none' &&
      senatorValue !== 'no' &&
      senatorValue !== 'na'
    ) {
      const firstSenator = rep.senatorsSignedSenateVersion.split(',')[0].trim()
      senatorSentence = `Earlier this year, Senator ${firstSenator} also joined a Senate letter expressing the same position.`
    }

    // Conditionally add previous letter URLs after Quill link
    let previousLetterLinks = ''
    if (rep.signed115th) previousLetterLinks += `\nHere is the 115th letter: ${letter115}`
    if (rep.signed117th) previousLetterLinks += `\nHere is the 117th letter: ${letter117}`
    if (rep.signed118th) previousLetterLinks += `\nHere is the 118th letter: ${letter118}`

    // Conditionally add Senate letter link
    if (
      rep.senatorsSignedSenateVersion &&
      senatorValue !== 'none' &&
      senatorValue !== 'no' &&
      senatorValue !== 'na'
    ) {
      previousLetterLinks += `\nHere is the 2025 Senate letter: ${senateLetter}`
    }

    return `Hi ${getFirstNamesFromEmails(rep.legislativeContacts) || rep.name},

Thank you for your consistent support of efforts to promote a safe and sustainable food system.

I'm reaching out to see if Rep. ${rep.name} would consider signing onto a letter currently circulating in the House, which is being led by Reps. Simon, Costa, and McGovern. The letter urges the House Agriculture Committee to reject any provision that would override state-level standards for certain agricultural products. ${signingSentence}
${senatorSentence ? `\n${senatorSentence}\n` : ''}
These letters oppose what was once known as the "Steve King Amendment," later rebranded as the "EATS Act," though the intent remains the same—stripping states of their right to protect animals, farmers, and consumers.
${previousLetterLinks ? `${previousLetterLinks}\n` : ''}
For any questions or to add your boss's name, you can reach out to Sydney Dahiyat in Rep. Simon's office (Sydney.Dahiyat@mail.house.gov) or John Swords in Rep. McGovern's office (John.Swords@mail.house.gov).

Thanks again for your leadership on this issue, and for considering this latest request.

Best,
${orgName || '[Your Name]'}

--

`
  }

  const personalizeEmail = async (rep: Rep) => {

    setIsPersonalizing(true)
    try {
      const originalEmail = generateEmailBody(rep)
      const letterIndex = originalEmail.indexOf(fullLetterText)
      let mainBody = originalEmail

      if (letterIndex !== -1) {
        mainBody = originalEmail.slice(0, letterIndex).trim()
      }

      const getSenatorLastName = (senatorString: string) => {
        if (!senatorString) return ''
        const value = senatorString.trim().toLowerCase()
        if (value === 'none' || value === 'no' || value === 'na') return ''
        const first = senatorString.split(',')[0].trim()
        const parts = first.split(' ')
        return parts[parts.length - 1]
      }

      const repInfo = {
        stateDistrict: rep.stateDistrict,
        signedCurrent: rep.signedCurrent,
        signed118th: rep.signed118th,
        signed117th: rep.signed117th,
        signed115th: rep.signed115th,
        senatorsSignedSenateVersion: getSenatorLastName(rep.senatorsSignedSenateVersion)
      }

      const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalEmail: mainBody,
          repName: rep.name,
          repInfo
        })
      })

      if (!response.ok) {
        throw new Error('Failed to personalize email')
      }

      const data = await response.json()
      // Always append the original fullLetterText after the AI-personalized main body
      const personalizedWithLetter = `${data.personalizedEmail}\n\n${fullLetterText}`
      setPersonalizedEmail(personalizedWithLetter)
      setEditableEmail(personalizedWithLetter) // Update editable version
      setUsePersonalized(true)
    } catch (error) {
      console.error('Error personalizing email:', error)
      alert('Failed to personalize email. Please try again.')
    } finally {
      setIsPersonalizing(false)
    }
  }

  const handleEmail = (rep: Rep) => {
    const subject = `Request to Sign Letter Opposing EATS Act Provisions`
    const emailBody = editableEmail || generateEmailBody(rep) // Use editable version

    try {
      // Clean the email body to remove any problematic characters
      const cleanEmailBody = emailBody
        .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes with regular quotes
        .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
        .replace(/[\u2013\u2014]/g, '-') // Replace en/em dashes with regular dash
        .replace(/[\u00A0]/g, ' ') // Replace non-breaking spaces

      // Build Gmail URL with proper encoding
      const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1'
      const params = new URLSearchParams({
        to: rep.legislativeContacts || '',
        su: subject,
        body: cleanEmailBody
      })

      const gmailUrl = `${baseUrl}&${params.toString()}`
      window.open(gmailUrl, '_blank')

    } catch (error) {
      console.error('Error creating Gmail URL:', error)
      // Fallback to mailto
      const mailtoLink = `mailto:${rep.legislativeContacts}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
      window.open(mailtoLink)
    }
  }

  // Add a function to reset personalization when modal opens (around line 190)
  const handleRepClick = (rep: Rep) => {
    setSelectedRep(rep)
    setPersonalizedEmail('')
    setUsePersonalized(false)
    setIsPersonalizing(false)
    setEditableEmail(generateEmailBody(rep)) // Initialize with standard email
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            EATS Act Outreach Tool for Orgs
          </h1>
          <ol className="text-slate-600 text-lg">
            <li>1. Use the filter below to select your state and find your representatives (these are only democratic reps).</li>
            <li>2. Select your representative&apos;s name</li>
            <li>3. Personalize your email with AI and add your organization</li>
            <li>4. Send your email</li>
          </ol>

          {/* Check your work */}
          <div className="text-red-700 text-lg font-bold mt-4">Caveats:
            <ul className="list-decimal list-inside">
              <li>Always remember to check for accuracy before sending! Like with any AI, models are not perfect and are prone to making mistakes.</li>
              <li>The emails drafted by this tool are ONLY meant to sent by ORGANIZATIONS, NOT individuals. Every organization should only send one email for each representative.</li>
            </ul>
          </div>

          {/* Feedback */}
          <div className="mt-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-1 w-84">
            <span className="text-yellow-800 text-sm font-medium">See something wrong? Provide feedback</span>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=Allenlu0007@gmail.com&su=EATS%20Outreach%20Tool%20Feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline text-sm font-semibold"
            >
              here
            </a>
            .
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Loading Representatives...</h3>
              <p className="text-slate-600 text-center max-w-md">
                Fetching the latest data from Google Sheets. This may take a moment.
              </p>
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-16">
              {/* ...error UI... */}
            </div>
          ) : (
            // Loaded State
            <>
              <div className="flex items-center justify-between mb-4">
                <StateFilter
                  states={states}
                  onSelect={setStateFilter}
                  allReps={reps}
                />
                {/* Rep name search bar */}
                <div className="flex items-center gap-4">
                  <p className="text-slate-700 font-bold">Search by Rep name:</p>
                  <input
                    type="text"
                    value={repSearch}
                    onChange={e => setRepSearch(e.target.value)}
                    placeholder="Search by Rep name"
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-slate-700 placeholder-slate-400 w-64"
                  />
                </div>
              </div>
              <RepList
                reps={filteredReps}
                allReps={reps}
                onRepClick={handleRepClick}
              />

              {/* Show current filter info */}
              {stateFilter && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-sm">
                    Showing {filteredReps.length} representatives from {stateFilter}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Email Modal */}
        {selectedRep && (
          // Line 232 - try removing the backdrop entirely or using rgba
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setSelectedRep(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRep.name}</h2>
                    <p className="text-blue-100">{selectedRep.stateDistrict}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRep(null)}
                    className="text-white hover:text-gray-200 text-3xl font-light cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Representative Info - Smaller column */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      Representative Information
                    </h3>

                    {/* SIGNING HISTORY */}
                    <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      Signing History
                    </h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                        <span className="text-xs text-slate-700">Current Letter:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedRep.signedCurrent
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                          }`}>
                          {selectedRep.signedCurrent ? '✓ Signed' : '○ Not Signed'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                        <span className="text-xs text-slate-700">118th Congress:</span>
                        <span className={selectedRep.signed118th ? 'text-emerald-600' : 'text-slate-400'}>
                          {selectedRep.signed118th ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                        <span className="text-xs text-slate-700">117th Congress:</span>
                        <span className={selectedRep.signed117th ? 'text-emerald-600' : 'text-slate-400'}>
                          {selectedRep.signed117th ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                        <span className="text-xs text-slate-700">115th Congress:</span>
                        <span className={selectedRep.signed115th ? 'text-emerald-600' : 'text-slate-400'}>
                          {selectedRep.signed115th ? '✓' : '○'}
                        </span>
                      </div>
                    </div>

                    {/* CONTACT */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm font-bold text-slate-700">Legislative Contacts:</span>
                        <p className="text-sm text-slate-700">{selectedRep.legislativeContacts || 'Not available'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-700">Legislative Director:</span>
                        <p className="text-sm text-slate-700">{selectedRep.legislativeDirector || 'Not available'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-700">Senator who signed 2025 Senate letter:</span>
                        <p className="text-sm text-slate-700">{selectedRep.senatorsSignedSenateVersion || 'None listed'}</p>
                      </div>

                      <div className="mt-8">
                        <span className="text-sm text-slate-500">Office Phone:</span>
                        <p className="text-sm text-slate-700">{selectedRep.officePhone || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      Outreach Email
                    </h3>

                    {/* Organization name input */}
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <div className="w-64">
                        <label htmlFor="orgName" className="block mb-2 text-sm font-medium text-slate-700">
                          Your Organization Name:
                        </label>
                        <input
                          id="orgName"
                          type="text"
                          placeholder="Enter your organization name"
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-slate-700 placeholder-slate-400"
                        />
                      </div>
                      <button
                        onClick={() => personalizeEmail(selectedRep)}
                        disabled={isPersonalizing}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {isPersonalizing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Personalizing...
                          </>
                        ) : (
                          <>
                            Personalize Email with A.I.
                          </>
                        )}
                      </button>
                    </div>

                    {/* Move textarea to the top */}
                    <div className="mb-2">
                      <p className="text-xs text-slate-500 mb-2">
                        You can directly edit the email content below. Changes will be reflected when you send the email.
                      </p>

                      <textarea
                        value={editableEmail}
                        onChange={handleEmailChange}
                        className="w-full h-80 p-4 bg-gray-50 border border-slate-300 rounded-lg resize-none focus:outline-none focus:border-blue-400 text-sm text-slate-700 leading-relaxed font-mono"
                        placeholder="Email content will appear here..."
                      />
                    </div>

                    {/* Buttons directly below textarea */}
                    <div className="mb-6">
                      <p className="text-sm text-slate-700 font-semibold mb-2">
                        This will automatically open to Gmail and paste in the email content above!
                      </p>
                      <button
                        onClick={() => handleEmail(selectedRep)}
                        className="flex-1 bg-green-700 text-white px-16 py-2 rounded-lg text-base font-semibold hover:bg-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home