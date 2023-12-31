import { useState } from 'react'

const StatisticLine = ({text, value}) => <p>{text} {value}</p>

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
      <StatisticLine text="good" value={good}></StatisticLine>
      <StatisticLine text="neutral" value={neutral}></StatisticLine>
      <StatisticLine text="bad" value={bad}></StatisticLine>
      <StatisticLine text="all" value={calculateTotalResponses()}></StatisticLine>
      <StatisticLine text="average" value={calculateAverage()}></StatisticLine>
      <StatisticLine text="positive" value={calculatePositivePercentage() + " %"}></StatisticLine>
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

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good"></Button>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"></Button>
      <Button handleClick={() => setBad(bad + 1)} text="bad"></Button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App