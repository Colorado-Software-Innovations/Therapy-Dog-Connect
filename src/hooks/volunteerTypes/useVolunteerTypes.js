import { useCallback } from 'react';
import axios from 'axios';
import { FETCH_VOLUNTEER_TYPES } from '../../constants/restfulQueryConstants';

function useVolunteerTypes() {
  const getVolunteerTypes = useCallback((venue_id) => {
    return axios
      .get(`${FETCH_VOLUNTEER_TYPES}?venue_id=${venue_id}`)
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);

  return {
    getVolunteerTypes,
  };
}

export default useVolunteerTypes;
