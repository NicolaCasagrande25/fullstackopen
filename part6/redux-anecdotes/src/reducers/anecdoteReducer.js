import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote: (state, action) => {
      return [...state, action.payload]
    },
    voteAnecdote: (state, action) => {
      const id = action.payload
      const anecdoteToVote = state.find(anectode => anectode.id === id)
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state
        .map(anecdote => anecdote.id !== id ? anecdote : updatedAnecdote)
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes: (state, action) => action.payload
  }
})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default anecdoteSlice.reducer