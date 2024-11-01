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
  const fetchAllVenues = useCallback(() => {
    return axios
      .get(FETCH_ALL_VENUES, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);
  const fetchVenueById = useCallback((id) => {
    return axios
      .get(FETCH_VENUE_BY_ID.replace(':id', id), {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => err);
  }, []);

  const updateVenue = useCallback((id, payload) => {
    return axios
      .put(UPDATE_VENUE.replace(':id', id), payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => err);
  }, []);

  const deleteVenue = useCallback((id) => {
    return axios
      .delete(DELETE_VENUE.replace(':id', id), {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => err);
  }, []);

  const addVenue = useCallback((payload) => {
    return axios
      .post(ADD_VENUE, payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
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
