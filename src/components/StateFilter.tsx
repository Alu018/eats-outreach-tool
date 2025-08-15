import React from 'react'

interface Props {
  states: string[]
  onSelect: (state: string) => void
  allReps?: any[]  // Add this to count reps per state
}

const StateFilter: React.FC<Props> = ({ states, onSelect, allReps = [] }) => {
  // Count reps per state
  const getRepCount = (state: string) => {
    return allReps.filter(rep => rep.stateDistrict.startsWith(state)).length
  }

  return (
    <div className="mb-6">
      <label htmlFor="state-filter" className="block mb-3 text-lg font-semibold text-slate-700">
        Filter by State:
      </label>
      <select 
        id="state-filter"
        onChange={e => onSelect(e.target.value)}
        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-slate-700 text-base shadow-sm hover:border-blue-300 transition-colors min-w-64"
      >
        <option value="">All states</option>
        {states.map(state => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  )
}

export default StateFilter