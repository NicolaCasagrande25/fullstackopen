import { useSelector, useDispatch } from "react-redux";
import { increaseVotes } from "../reducers/anecdoteReducer"
import { addNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => anecdotes.filter((anecdote) => anecdote.content.includes(filter)));
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(increaseVotes(anecdote.id));
    dispatch(addNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
