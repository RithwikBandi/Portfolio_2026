import Picture from './Picture.jsx'
import Frame from './Frame.jsx'
import SampleTimetable from './SampleTimetable.jsx'

// The framed visual for a project. data-plate lets a page transition find it, so the same
// preview morphs between the home showcase and the case-study header (see transition.js).
export default function Plate({ project, interactive = false, eager = false, sizes }) {
  const { plate, slug } = project
  const isTable = plate.kind === 'timetable'

  return (
    <Frame host={plate.host} tt={isTable} caption={plate.caption} plate={slug}>
      {isTable ? (
        <SampleTimetable interactive={interactive} />
      ) : (
        <Picture name={plate.image} alt={interactive ? plate.alt : ''} sizes={sizes} eager={eager} />
      )}
    </Frame>
  )
}
