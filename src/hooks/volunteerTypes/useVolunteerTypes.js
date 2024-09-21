import { useCallback } from 'react';
import axios from 'axios';
import {
  FETCH_VOLUNTEER_TYPES,
  UPDATE_VOLUNTEER_TYPES,
  ADD_VOLUNTEER_TYPE,
} from '../../constants/restfulQueryConstants';

function useVolunteerTypes() {
  const getVolunteerTypes = useCallback((venue_id) => {
    return axios
      .get(`${FETCH_VOLUNTEER_TYPES}?venue_id=${venue_id}&is_deleted=0`, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);

  const updateVolunteerType = useCallback((id, payload) => {
    return axios
      .put(UPDATE_VOLUNTEER_TYPES.replace(':id', id), payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);

  const addVolunteerType = useCallback((payload) => {
    return axios
      .post(ADD_VOLUNTEER_TYPE, payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);

  return {
    getVolunteerTypes,
    updateVolunteerType,
    addVolunteerType,
  };
}

export default useVolunteerTypes;
