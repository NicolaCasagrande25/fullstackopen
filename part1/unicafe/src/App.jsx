import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {

  function calculateTotalResponses(){
    return good + neutral + bad
  }

  function calculateAverage(){
    return (good - bad) / calculateTotalResponses()
  }

  function calculatePositivePercentage(){
    return good / calculateTotalResponses() * 100
  }

  if(calculateTotalResponses() > 0){
  return(
    <div>
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {calculateTotalResponses()}</p>
      <p>average {calculateAverage()}</p>
      <p>positive {calculatePositivePercentage()} %</p>
    </div>
  )} else {
    return(
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App