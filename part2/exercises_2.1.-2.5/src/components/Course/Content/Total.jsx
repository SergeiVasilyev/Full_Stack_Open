const Total = ({ parts }) => {
    let total = parts.reduce((sum, part) => sum + part.exercises, 0)

    let plural = 's'
    if (total === 1) plural = ''

    return <p><b>Total {total} course{plural}</b></p>
}

export default Total