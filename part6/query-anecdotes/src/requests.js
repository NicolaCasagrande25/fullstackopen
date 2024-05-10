import axios from "axios";

export const getAnecdotes = async () => {
    const response = await axios.get("http://localhost:3001/anecdotes");
    return response.data;
};