/* eslint-disable no-undef */
import { useCallback } from 'react';
import axios from 'axios';
import { FETCH_DOG, UPDATE_DOG } from '../../constants/restfulQueryConstants';

function useDogs() {
  const fetchDogByUserId = useCallback((id) => {
    return axios
      .get(`${FETCH_DOG}?user_id=${id}`, {
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  });

  const updateDog = useCallback((id, payload) => {
    console.log('PAYLOAD', payload);
    return axios
      .put(`${UPDATE_DOG}`.replace(':dogId', id), payload, {
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  });

  return {
    fetchDogByUserId,
    updateDog,
  };
}

export default useDogs;
