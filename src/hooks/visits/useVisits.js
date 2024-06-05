import axios from 'axios';
import { ADD_VISIT, FETCH_VISIT_BY_HOSPITAL_ID } from '../../constants/restfulQueryConstants';
import { useCallback } from 'react';

function useVisits() {
  const addVisit = useCallback((payload) => {
    return axios
      .post(ADD_VISIT, payload)
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const fetchVisitsByHospitalId = useCallback((id) => {
    return axios
      .get(FETCH_VISIT_BY_HOSPITAL_ID.replace(':id', id))
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);
  return {
    addVisit,
    fetchVisitsByHospitalId,
  };
}

export default useVisits;
