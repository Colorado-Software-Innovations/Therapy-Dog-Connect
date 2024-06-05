import { useCallback } from 'react';
import axios from 'axios';
import { ADD_PERSON, DELETE_PERSON, UPDATE_PERSON } from '../../constants/restfulQueryConstants';

function usePerson() {
  const addPerson = useCallback((payload) => {
    return axios
      .post(ADD_PERSON, payload)
      .then((response) => response)
      .catch((err) => {
        console.error('Failed to create person.', err);
        throw err;
      });
  }, []);

  const deletePerson = useCallback((id) => {
    return axios
      .delete(DELETE_PERSON.replace(':id', id))
      .then((response) => response)
      .catch((err) => {
        console.error('Failed to delete person.', err);
        throw err;
      });
  }, []);

  const updatePerson = useCallback((id, payload) => {
    return axios
      .put(UPDATE_PERSON.replace(':id', id), payload)
      .then((response) => response)
      .catch((err) => {
        console.error('Failed to update person.', err);
        throw err;
      });
  }, []);

  return {
    addPerson,
    deletePerson,
    updatePerson,
  };
}

export default usePerson;
