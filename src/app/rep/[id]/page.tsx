'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Rep } from '../../../types'

const RepDetail: React.FC = () => {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const [rep, setRep] = useState<Rep | null>(null)
    const [orgName, setOrgName] = useState('')

    const quillLink = `https://quill.senate.gov/letters/letter/28457/opt-in/view/aaaaac2a-acbd-4efa-885f-22cd234cbd8a/`

    const fullLetterText = `Letter Text

        Dear Chairman Thompson and Ranking Member Craig,

        We write today expressing our strong opposition to the inclusion of the Save Our Bacon (SOB) Act (H.R. 4673), which is simply the same language as Sec. 12007 of last year’s Farm, Food, and National Security Act of 2024 (H.R.8467); the Food Security and Farm Protection Act (S. 1306); or any similar legislation being considered as part of a “skinny” farm bill or other legislative vehicle. Modeled after former Representative Steve King’s amendment, which was intensely controversial and ultimately excluded from the final 2014 and 2018 Farm Bills, the SOB Act and related proposals would harm America’s farmers, threaten numerous state laws, and infringe on the fundamental rights of states to establish laws and regulations within their own borders. 

        Demand from consumers, food companies, and the farming community has propelled 15 states to enact public health, food safety, and humane standards for the in-state production and sale of products from egg-laying chickens, veal calves, and mother pigs. Many pork and egg farmers have already invested significantly in transitioning to crate-free and cage-free production. The United Egg Producers, the egg industry’s trade association, opposes reversing state cage-free laws, as do many pork producers who have embraced the new market opportunities that these laws have created.

        But the SOB Act and related measures are promoted with the primary goal of undermining these standards – particularly California’s Proposition 12, which the U.S. Supreme Court upheld in a 2023 decision. In that decision, the Court affirmed that states have the authority to regulate the sale of products within their borders and noted that, “Companies that choose to sell products in various States must normally comply with the laws of those various States.” In June, the Supreme Court declined to hear yet another pork industry challenge to Proposition 12 when it denied certiorari to the Iowa Pork Producers Association. It is worth noting that Proposition 12 and all implementing regulations were in full effect as of January 1, 2024. 

        The SOB Act aims to undermine the basic principles of federalism by preempting hundreds of state and local laws, even where no federal standards exist, creating a regulatory vacuum. In doing so, the SOB Act and similar iterations would drastically broaden the scope of federal preemption and impede the ability of voters and elected officials to enact laws that address local concerns due to the unique nature of individual communities. 

        This is not a case of California and other states imposing their standards on out-of-state producers, as producers in any state can choose not to supply another state’s consumers or to segregate animals for different markets. Pork industry economists noted this in an amicus brief, writing, “Only those producers for which compliance with Proposition 12 is economically beneficial will choose to do so, while all others will continue to supply the vast majority of the North American pork market beyond California’s border and face little or no economic impact.” Additionally, a recent empirical study by three USDA-affiliated economists found no evidence that Proposition 12 impacted pork products outside of California. Using Circana retail scanner data, the study examined early price impacts on covered pork products in both California and the broader U.S. market, concluding there were none. 

        Notably, the importance of trade markets abroad lies in providing key opportunities for pork and other meat producers, particularly those who opt not to sell within the United States. Key export destinations such as China, Mexico, and Canada accounted for a total trade value of $4.852 billion at the end of 2024, according to data from the Meat Institute.

        At the same time, many large pork producers, including Clemens, JBS, Hormel, Perdue, Tyson, and Smithfield, as well as many independent farmers and producers, are following Proposition 12’s standards and supplying state markets. A joint amicus brief submitted by independent farming businesses, farm advocacy organizations including the National Sustainable Agriculture Coalition, and state farmers unions for Indiana, Iowa, Pennsylvania, Idaho, Oregon and Washington stated, “Independent farmers are willing to meet this demand, and in doing so, can access some of the wealth and power that has accumulated only for pork integrators, and redistribute it back to local communities, businesses, and families.” The SOB Act would undermine this progress and devalue the investments that farmers have already made to comply with Proposition 12 and similar laws. 

        Besides attacking sales laws related to animal welfare, the SOB Act and related measures  could jeopardize how states set standards for disease and quarantine control, toxic materials, and more. 

        We believe that Congress should not usurp the longstanding power of states to regulate food and agricultural products within their borders. We need not agree with every law or rule adopted by each state to adhere to this core principle of federalism. We urge you to reject the inclusion of this provision in any form in any legislative vehicle. Thank you for your consideration.


        ###`

    useEffect(() => {
        if (!id) return
        fetch('/api/reps')
            .then(res => res.json())
            .then((data: Rep[]) => setRep(data[Number(id)]))
    }, [id])

    if (!rep) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading representative details...</p>
            </div>
        </div>
    )

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

    const emailBody = `Hi ${getFirstNamesFromEmails(rep.legislativeContacts) || rep.name},

Thank you for your consistent support of efforts to promote a safe and sustainable food system.
 
I'm reaching out to see if Rep. ${rep.name} would consider signing onto the letter below, which is being led by Reps. Simon, Costa, and McGovern. The letter urges the House Agriculture Committee to reject any provision that would override state-level standards for certain agricultural products. In 2023, over 170 House Democrats signed a similar opposition letter. 
 
Earlier this year, Senator Gillibrand also joined a Senate letter expressing the same position.
 
These letters oppose what was once known as the "Steve King Amendment," later rebranded as the "EATS Act," though the intent remains the same—stripping states of their right to protect animals, farmers, and consumers.
 
Here is the Quill link: ${quillLink}

For any questions or to add your boss's name, you can reach out to Sydney Dahiyat in Rep. Simon's office (Sydney.Dahiyat@mail.house.gov) or John Swords in Rep. McGovern's office (John.Swords@mail.house.gov).

Thanks again for your leadership on this issue, and for considering this latest request. The full letter text is below.

Best,
${orgName || '[Your Name]'}

--

${fullLetterText}`

    const handleEmail = () => {
        const subject = `Request to Sign Letter Opposing EATS Act Provisions`

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

            console.log('Gmail URL length:', gmailUrl.length) // Debug log
            window.open(gmailUrl, '_blank')

        } catch (error) {
            console.error('Error creating Gmail URL:', error)
            // Fallback to mailto
            const mailtoLink = `mailto:${rep.legislativeContacts}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
            window.open(mailtoLink)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
            <div className="container mx-auto px-6 py-8 max-w-5xl">
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-lg text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                >
                    <span className="text-lg">←</span>
                    Back to List
                </button>

                <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{rep.name}</h1>
                    <p className="text-xl text-blue-600 font-medium">{rep.stateDistrict}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Representative Info */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="text-blue-600">ℹ️</span>
                            Representative Information
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-slate-500">Office Phone:</span>
                                <p className="text-slate-700">{rep.officePhone || 'Not available'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500">Legislative Contacts:</span>
                                <p className="text-slate-700">{rep.legislativeContacts || 'Not available'}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3 flex items-center gap-2">
                            <span className="text-blue-600">📝</span>
                            Signing History
                        </h3>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                                <span className="text-slate-700">Current Letter:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${rep.signedCurrent
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {rep.signedCurrent ? '✓ Signed' : '○ Not Signed'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                                <span className="text-slate-700">118th Congress:</span>
                                <span className={rep.signed118th ? 'text-emerald-600' : 'text-slate-400'}>
                                    {rep.signed118th ? '✓' : '○'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                                <span className="text-slate-700">117th Congress:</span>
                                <span className={rep.signed117th ? 'text-emerald-600' : 'text-slate-400'}>
                                    {rep.signed117th ? '✓' : '○'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                                <span className="text-slate-700">115th Congress:</span>
                                <span className={rep.signed115th ? 'text-emerald-600' : 'text-slate-400'}>
                                    {rep.signed115th ? '✓' : '○'}
                                </span>
                            </div>
                        </div>

                        {rep.senatorsSignedSenateVersion && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-sm font-medium text-blue-700">Senate Support:</span>
                                <p className="text-blue-600 text-sm mt-1">{rep.senatorsSignedSenateVersion}</p>
                            </div>
                        )}
                    </div>

                    {/* Email Section */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="text-blue-600">✉️</span>
                            Outreach Email
                        </h2>

                        <div className="mb-4">
                            <label htmlFor="orgName" className="block mb-2 text-sm font-medium text-slate-700">
                                Your Organization Name:
                            </label>
                            <input
                                id="orgName"
                                type="text"
                                placeholder="Enter your organization name"
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-slate-700 placeholder-slate-400"
                            />
                        </div>

                        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
                            <h3 className="text-sm font-medium text-slate-600 mb-2">Email Preview:</h3>
                            <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                                {emailBody}
                            </pre>
                        </div>

                        <button
                            onClick={handleEmail}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <span className="text-xl">📧</span>
                            Send Email to {rep.name}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RepDetail