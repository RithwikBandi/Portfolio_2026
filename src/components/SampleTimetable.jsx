import { useState } from 'react'

// A faithful miniature of the SRU Timetable grid, using made-up sample data.
// The "Free Time" view runs the same kind of analysis the real app does:
// count free slots and find the longest consecutive break.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const SLOTS = ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30']

// [code, type, room] or null for a free slot. Types: L lecture, T tutorial, P lab.
const GRID = {
  Mon: [['DBMS', 'L', 'R-204'], ['DBMS', 'L', 'R-204'], null, ['OS', 'L', 'R-110'], ['DAA', 'T', 'R-301'], null],
  Tue: [['DAA', 'L', 'R-301'], null, ['PYL', 'P', 'Lab 2'], ['PYL', 'P', 'Lab 2'], ['PYL', 'P', 'Lab 2'], ['CN', 'L', 'R-204']],
  Wed: [['OS', 'L', 'R-110'], ['CN', 'L', 'R-204'], null, null, ['DAA', 'T', 'R-301'], null],
  Thu: [['DBMS', 'T', 'R-204'], ['DAA', 'L', 'R-301'], null, ['OS', 'L', 'R-110'], null, ['CN', 'L', 'R-204']],
  Fri: [null, ['DBMS', 'L', 'R-204'], ['ELEC', 'L', 'R-402'], ['ELEC', 'L', 'R-402'], null, null],
}

function analyse() {
  let free = 0
  let best = { len: 0, day: '', from: 0 }
  for (const day of DAYS) {
    let run = 0
    GRID[day].forEach((cell, i) => {
      if (cell) { run = 0; return }
      free += 1
      run += 1
      if (run > best.len) best = { len: run, day, from: i - run + 1 }
    })
  }
  return { free, best }
}
const STATS = analyse()

export default function SampleTimetable({ interactive = false }) {
  const [mode, setMode] = useState('week')
  const showFree = mode === 'free'
  const { free, best } = STATS
  const from = SLOTS[best.from]

  return (
    <div className={`tt${showFree ? ' tt--free' : ''}`} aria-hidden={interactive ? undefined : 'true'}>
      {interactive && (
        <div className="tt__bar">
          <div className="seg" role="group" aria-label="Timetable view">
            <button type="button" aria-pressed={!showFree} onClick={() => setMode('week')}>My Timetable</button>
            <button type="button" aria-pressed={showFree} onClick={() => setMode('free')}>Free Time</button>
          </div>
          <p className="mono tt__stat" aria-live="polite">
            {showFree
              ? `${free} free slots · longest break ${best.len}h, ${best.day} from ${from}`
              : 'Sample batch · 6 slots × 5 days'}
          </p>
        </div>
      )}

      <table>
        <caption className="sr-only">Sample weekly timetable with made-up data</caption>
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Time</span></th>
            {DAYS.map((d) => (
              <th key={d} scope="col">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((slot, r) => (
            <tr key={slot}>
              <th scope="row">{slot}</th>
              {DAYS.map((d, c) => {
                const cell = GRID[d][r]
                const style = { '--c': c }
                return cell ? (
                  <td key={d} className={`tt__${cell[1].toLowerCase()}`} style={style}>
                    <b>{cell[0]}</b>
                    <small>{cell[2]}</small>
                  </td>
                ) : (
                  <td key={d} className="tt__free" style={style}>
                    <span>free</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {interactive && (
        <p className="mono tt__legend">L lecture · T tutorial · P lab · Sample data, not a real batch</p>
      )}
    </div>
  )
}
