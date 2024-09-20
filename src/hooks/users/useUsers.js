import { useCallback } from 'react';
import axios from 'axios';
import {
  ADD_PERSON,
  DELETE_PERSON,
  UPDATE_PERSON,
  GET_USERS_BY_VENUE_ID,
} from '../../constants/restfulQueryConstants';

function useUser() {
  const addPerson = useCallback((payload) => {
    return axios
      .post(ADD_PERSON, payload)
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const deletePerson = useCallback((id) => {
    return axios
      .delete(DELETE_PERSON.replace(':id', id))
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const updatePerson = useCallback((id, payload) => {
    return axios
      .put(UPDATE_PERSON.replace(':id', id), payload)
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const getUserByVenueId = useCallback((venue_id) => {
    return axios
      .get(GET_USERS_BY_VENUE_ID.replace(':id', venue_id))
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => {
        throw err;
      });
  }, []);
  return {
    addPerson,
    deletePerson,
    updatePerson,
    getUserByVenueId,
  };
}

export default useUser;
