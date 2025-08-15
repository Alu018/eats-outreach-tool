import React from 'react'
import { Rep } from '../types'

interface Props {
    reps: Rep[]
    allReps?: Rep[]
    onRepClick: (rep: Rep) => void
}

// Remove unused parameters
const RepList: React.FC<Props> = ({ reps, onRepClick }) => {
    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-r border-blue-200 last:border-r-0">
                                Representative
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-r border-blue-200 last:border-r-0">
                                District
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-r border-blue-200 last:border-r-0">
                                Current Letter
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                Previous Letters
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reps.map((rep) => (
                            <tr
                                key={`${rep.name}-${rep.stateDistrict}`}
                                className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                                onClick={() => onRepClick(rep)}
                            >
                                <td className="px-6 py-4 border-r border-blue-100 last:border-r-0">
                                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                                        {rep.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-r border-blue-100 last:border-r-0 text-slate-600 font-medium">
                                    {rep.stateDistrict}
                                </td>
                                <td className="px-6 py-4 border-r border-blue-100 last:border-r-0">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${rep.signedCurrent
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                                        }`}>
                                        {rep.signedCurrent ? '✓ Signed' : '○ Not Signed'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex gap-3 text-sm">
                                        <span className={`font-medium ${rep.signed118th ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            118th: {rep.signed118th ? '✓' : '○'}
                                        </span>
                                        <span className={`font-medium ${rep.signed117th ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            117th: {rep.signed117th ? '✓' : '○'}
                                        </span>
                                        <span className={`font-medium ${rep.signed115th ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            115th: {rep.signed115th ? '✓' : '○'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {reps.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <div className="text-4xl mb-4">🏛️</div>
                    <p className="text-lg">No representatives found for the selected filters.</p>
                </div>
            )}
        </div>
    )
}

export default RepList