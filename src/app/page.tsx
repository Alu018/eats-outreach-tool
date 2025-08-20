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

  // ...existing constants (quillLink, fullLetterText)...
  const quillLink = `https://quill.senate.gov/letters/letter/28457/opt-in/view/aaaaac2a-acbd-4efa-885f-22cd234cbd8a/`;
  const letter115 = `https://www.foodsolutionsaction.org/may2018115th`;
  const letter117 = `https://schrier.house.gov/sites/evo-subsites/schrier.house.gov/files/evo-media-document/Prop%2012%20Letter%20FINAL.pdf?utm_source=chatgpt.com`;
  const letter118 = `https://animalwellnessaction.org/wp-content/uploads/2023/08/Anti-EATS-Act-House-letter-171-signers.pdf`;
  const senateLetter = `https://www.padilla.senate.gov/newsroom/press-releases/padilla-schiff-booker-markey-lead-28-senate-colleagues-in-effort-to-protect-californias-proposition-12/`;

  const fullLetterText = `Letter Text

        Dear Chairman Thompson and Ranking Member Craig,

        We write today expressing our strong opposition to the inclusion of the Save Our Bacon (SOB) Act (H.R. 4673), which is simply the same language as Sec. 12007 of last year's Farm, Food, and National Security Act of 2024 (H.R.8467); the Food Security and Farm Protection Act (S. 1306); or any similar legislation being considered as part of a "skinny" farm bill or other legislative vehicle. Modeled after former Representative Steve King's amendment, which was intensely controversial and ultimately excluded from the final 2014 and 2018 Farm Bills, the SOB Act and related proposals would harm America's farmers, threaten numerous state laws, and infringe on the fundamental rights of states to establish laws and regulations within their own borders. 

        Demand from consumers, food companies, and the farming community has propelled 15 states to enact public health, food safety, and humane standards for the in-state production and sale of products from egg-laying chickens, veal calves, and mother pigs. Many pork and egg farmers have already invested significantly in transitioning to crate-free and cage-free production. The United Egg Producers, the egg industry's trade association, opposes reversing state cage-free laws, as do many pork producers who have embraced the new market opportunities that these laws have created.

        But the SOB Act and related measures are promoted with the primary goal of undermining these standards – particularly California's Proposition 12, which the U.S. Supreme Court upheld in a 2023 decision. In that decision, the Court affirmed that states have the authority to regulate the sale of products within their borders and noted that, "Companies that choose to sell products in various States must normally comply with the laws of those various States." In June, the Supreme Court declined to hear yet another pork industry challenge to Proposition 12 when it denied certiorari to the Iowa Pork Producers Association. It is worth noting that Proposition 12 and all implementing regulations were in full effect as of January 1, 2024. 

        The SOB Act aims to undermine the basic principles of federalism by preempting hundreds of state and local laws, even where no federal standards exist, creating a regulatory vacuum. In doing so, the SOB Act and similar iterations would drastically broaden the scope of federal preemption and impede the ability of voters and elected officials to enact laws that address local concerns due to the unique nature of individual communities. 

        This is not a case of California and other states imposing their standards on out-of-state producers, as producers in any state can choose not to supply another state's consumers or to segregate animals for different markets. Pork industry economists noted this in an amicus brief, writing, "Only those producers for which compliance with Proposition 12 is economically beneficial will choose to do so, while all others will continue to supply the vast majority of the North American pork market beyond California's border and face little or no economic impact." Additionally, a recent empirical study by three USDA-affiliated economists found no evidence that Proposition 12 impacted pork products outside of California. Using Circana retail scanner data, the study examined early price impacts on covered pork products in both California and the broader U.S. market, concluding there were none. 

        Notably, the importance of trade markets abroad lies in providing key opportunities for pork and other meat producers, particularly those who opt not to sell within the United States. Key export destinations such as China, Mexico, and Canada accounted for a total trade value of $4.852 billion at the end of 2024, according to data from the Meat Institute.

        At the same time, many large pork producers, including Clemens, JBS, Hormel, Perdue, Tyson, and Smithfield, as well as many independent farmers and producers, are following Proposition 12's standards and supplying state markets. A joint amicus brief submitted by independent farming businesses, farm advocacy organizations including the National Sustainable Agriculture Coalition, and state farmers unions for Indiana, Iowa, Pennsylvania, Idaho, Oregon and Washington stated, "Independent farmers are willing to meet this demand, and in doing so, can access some of the wealth and power that has accumulated only for pork integrators, and redistribute it back to local communities, businesses, and families." The SOB Act would undermine this progress and devalue the investments that farmers have already made to comply with Proposition 12 and similar laws. 

        Besides attacking sales laws related to animal welfare, the SOB Act and related measures  could jeopardize how states set standards for disease and quarantine control, toxic materials, and more. 

        We believe that Congress should not usurp the longstanding power of states to regulate food and agricultural products within their borders. We need not agree with every law or rule adopted by each state to adhere to this core principle of federalism. We urge you to reject the inclusion of this provision in any form in any legislative vehicle. Thank you for your consideration.


        ###`

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

  // ...existing helper functions...
  const filteredReps = stateFilter
    ? reps.filter(r => {
      // Extract state from the district and compare
      const stateMatch = r.stateDistrict.match(/^([A-Z]{2})/i)
      const repState = stateMatch ? stateMatch[1].toUpperCase() : ''
      return repState === stateFilter
    })
    : reps

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
    if (rep.senatorsSignedSenateVersion) {
      senatorSentence = `Earlier this year, Senator ${rep.senatorsSignedSenateVersion} also joined a Senate letter expressing the same position.`
    }

    // Conditionally add previous letter URLs after Quill link
    let previousLetterLinks = ''
    if (rep.signed115th) previousLetterLinks += `\nHere is the 115th letter: ${letter115}`
    if (rep.signed117th) previousLetterLinks += `\nHere is the 117th letter: ${letter117}`
    if (rep.signed118th) previousLetterLinks += `\nHere is the 118th letter: ${letter118}`

    return `Hi ${getFirstNamesFromEmails(rep.legislativeContacts) || rep.name},

Thank you for your consistent support of efforts to promote a safe and sustainable food system.

I'm reaching out to see if Rep. ${rep.name} would consider signing onto the letter below, which is being led by Reps. Simon, Costa, and McGovern. The letter urges the House Agriculture Committee to reject any provision that would override state-level standards for certain agricultural products. ${signingSentence}
${senatorSentence ? `\n${senatorSentence}\n` : ''}
These letters oppose what was once known as the "Steve King Amendment," later rebranded as the "EATS Act," though the intent remains the same—stripping states of their right to protect animals, farmers, and consumers.

Here is the Quill link: ${quillLink}${previousLetterLinks}

For any questions or to add your boss's name, you can reach out to Sydney Dahiyat in Rep. Simon's office (Sydney.Dahiyat@mail.house.gov) or John Swords in Rep. McGovern's office (John.Swords@mail.house.gov).

Thanks again for your leadership on this issue, and for considering this latest request. The full letter text is below.

Best,
${orgName || '[Your Name]'}

--

${fullLetterText}`
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

      const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalEmail: mainBody, // Only send the main body
          repName: rep.name,
          repInfo: {
            stateDistrict: rep.stateDistrict,
            signedCurrent: rep.signedCurrent,
            signed118th: rep.signed118th,
            signed117th: rep.signed117th,
            signed115th: rep.signed115th,
            senatorsSignedSenateVersion: rep.senatorsSignedSenateVersion
          }
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
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            EATS Act Outreach Tool - Democratic Representatives
          </h1>
          <p className="text-slate-600 text-lg">
            Use the filter below to select your state and find your representatives. Then select your representative&apos;s name to begin personalizing your outreach email.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          {isLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-16">
              {/* ...loading UI... */}
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
                <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
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
                        <p className="text-sm text-slate-500">{selectedRep.senatorsSignedSenateVersion || 'None listed'}</p>
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