import Part from './Part'
import Total from './Total'

const Content = ({ parts }) => {
    let partsList = parts.map((part) => <Part key={part.id} part={part} />)
    return (
      <>
        {partsList}
        <Total parts={parts} />
      </>
    )
}

export default Content