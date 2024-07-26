import { useCallback } from 'react';
import axios from 'axios';
import {
  FETCH_ROOM_BY_HOSPITAL_ID,
  ADD_ROOM,
  UPDATE_ROOM,
} from '../../constants/restfulQueryConstants';

function useRooms() {
  const fetchRoomsByHospitalId = useCallback((id) => {
    return axios
      .get(`${FETCH_ROOM_BY_HOSPITAL_ID.replace(':id', id)}&is_deleted=0`)
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => {
        throw err;
      });
  }, []);

  const addRoom = useCallback((payload) => {
    return axios
      .post(ADD_ROOM, payload)
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => {
        throw err;
      });
  }, []);

  const updateRoom = useCallback((id, payload) => {
    return axios
      .put(UPDATE_ROOM.replace(':id', id), payload)
      .then((response) => JSON.parse(response.data['body-json'].body))
      .catch((err) => {
        throw err;
      });
  }, []);

  return {
    addRoom,
    fetchRoomsByHospitalId,
    updateRoom,
  };
}

export default useRooms;
