import { useCallback } from 'react';
import axios from 'axios';
import {
  ADD_VENUE,
  DELETE_VENUE,
  FETCH_ALL_VENUES,
  FETCH_VENUE_BY_ID,
  UPDATE_VENUE,
} from '../../constants/restfulQueryConstants';

function useVenues() {
  const fetchAllVenues = useCallback((headers) => {
    return axios
      .get(FETCH_ALL_VENUES, headers)
      .then((response) => response)
      .catch((err) => err);
  }, []);
  const fetchVenueById = useCallback((id) => {
    return axios
      .get(FETCH_VENUE_BY_ID.replace(':id', id))
      .then((response) => response)
      .catch((err) => err);
  }, []);

  const updateVenue = useCallback((id, payload) => {
    return axios
      .put(UPDATE_VENUE.replace(':id', id), payload)
      .then((response) => response)
      .catch((err) => err);
  }, []);

  const deleteVenue = useCallback((id) => {
    return axios
      .delete(DELETE_VENUE.replace(':id', id))
      .then((response) => response)
      .catch((err) => err);
  }, []);

  const addVenue = useCallback((payload) => {
    return axios
      .post(ADD_VENUE, payload)
      .then((response) => response)
      .catch((err) => err);
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
