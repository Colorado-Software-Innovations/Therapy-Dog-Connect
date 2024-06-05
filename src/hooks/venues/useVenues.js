import { useCallback } from 'react';
import axios from 'axios';
import {
  ADD_VENUE,
  DELETE_ADDRESS,
  FETCH_ALL_VENUES,
  FETCH_VENUE_BY_ID,
  UPDATE_VENUE,
} from '../../constants/restfulQueryConstants';

function useVenues() {
  const fetchAllVenues = useCallback(() => {
    return axios
      .get(FETCH_ALL_VENUES)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }, []);
  const fetchVenueById = useCallback((id) => {
    return axios
      .get(FETCH_VENUE_BY_ID.replace(':id', id))
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }, []);

  const updateVenue = useCallback((id, payload) => {
    return axios
      .put(UPDATE_VENUE.replace(':id', id), payload)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }, []);

  const deleteVenue = useCallback((id) => {
    return axios
      .delete(DELETE_ADDRESS.replace(':id', id))
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }, []);

  const addVenue = useCallback((payload) => {
    return axios
      .post(ADD_VENUE, payload)
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  return {
    addVenue,
    deleteVenue,
    fetchAllVenues,
    fetchVenueById,
    updateVenue,
  };
}

export default useVenues;
