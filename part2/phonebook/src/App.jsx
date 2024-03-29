import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const updatePerson = (person) => {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const updatedPerson = { ...person, number: newNumber };
      personService
        .update(person.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : returnedPerson))
          );
          setMessage(`Updated phone number for ${returnedPerson.name}`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setMessage(error.response.data.error);
            setIsError(true);
            setTimeout(() => {
              setMessage(null);
              setIsError(false);
            }, 5000);
          } else {
            setMessage(
              `Information of ${person.name} has already been removed from server`
            );
            setIsError(true);
            setTimeout(() => {
              setMessage(null);
              setIsError(false);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== person.id));
          }
        });
      setNewName("");
      setNewNumber("");
    }
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    const foundPersonWithSameName = persons.find(
      (person) => person.name === newName
    );

    if (foundPersonWithSameName) {
      updatePerson(foundPersonWithSameName);
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setMessage(error.response.data.error);
          setIsError(true);
          setTimeout(() => {
            setMessage(null);
            setIsError(false);
          }, 5000);
        });
      setNewName("");
      setNewNumber("");
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError}></Notification>
      <Filter
        searchQuery={searchQuery}
        handleSearchQueryChange={handleSearchQueryChange}
      ></Filter>
      <h2>add a new</h2>
      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        deletePerson={deletePerson}
      ></Persons>
    </div>
  );
};

export default App;
