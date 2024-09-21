import { useCallback } from 'react';
import axios from 'axios';
import {
  ADD_ADDRESS,
  DELETE_ADDRESS,
  FETCH_ADDRESS_BY_ID,
  UPDATE_ADDRESS,
} from '../../constants/restfulQueryConstants';

function useAddress() {
  const fetchAddressById = useCallback((id) => {
    return axios
      .get(FETCH_ADDRESS_BY_ID.replace(':id', id), {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const addAddress = useCallback((payload) => {
    return axios
      .post(ADD_ADDRESS, payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const deleteAddress = useCallback((id) => {
    return axios
      .delete(DELETE_ADDRESS.replace(':id', id), {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  const updateAddress = useCallback((id, payload) => {
    return axios
      .put(UPDATE_ADDRESS.replace(':id', id), payload, {
        // eslint-disable-next-line no-undef
        headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
      })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  return {
    addAddress,
    deleteAddress,
    fetchAddressById,
    updateAddress,
  };
}
export default useAddress;
