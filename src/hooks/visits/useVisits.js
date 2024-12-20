import { useCallback } from 'react';
import axios from 'axios';
import { ADD_VISIT, FETCH_VISIT_BY_HOSPITAL_ID } from '../../constants/restfulQueryConstants';

function useVisits() {
  const requestVisit = useCallback((payload) => {
    return axios
      .post(ADD_VISIT, payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => {
        throw err;
      });
  }, []);

  const fetchVisitsByHospitalId = useCallback((id) => {
    return axios
      .get(FETCH_VISIT_BY_HOSPITAL_ID.replace(':id', id), {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);
  return {
    requestVisit,
    fetchVisitsByHospitalId,
  };
}

export default useVisits;
