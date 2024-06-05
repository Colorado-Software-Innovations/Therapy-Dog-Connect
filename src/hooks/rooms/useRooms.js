import { useCallback } from 'react';
import axios from 'axios';
import { FETCH_ROOM_BY_HOSPITAL_ID, ADD_ROOM } from '../../constants/restfulQueryConstants';

function useRooms() {
  const fetchRoomsByHospitalId = useCallback((id) => {
    return axios
      .get(FETCH_ROOM_BY_HOSPITAL_ID.replace(':id', id))
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }, []);

  const addRoom = useCallback((payload) => {
    return axios
      .post(ADD_ROOM, payload)
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  }, []);

  return {
    addRoom,
    fetchRoomsByHospitalId,
  };
}

export default useRooms;
