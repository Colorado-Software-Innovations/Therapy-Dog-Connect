import { useCallback } from 'react';
import axios from 'axios';
import {
  FETCH_ROOM_BY_HOSPITAL_ID,
  ADD_ROOM,
  UPDATE_ROOM,
} from '../../constants/restfulQueryConstants';

function useRooms() {
  const fetchRoomsByHospitalId = useCallback(
    (id) =>
      axios
        .get(`${FETCH_ROOM_BY_HOSPITAL_ID.replace(':id', id)}&is_deleted=0`, {
          // eslint-disable-next-line no-undef
          headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
        })
        .then((response) => JSON.parse(response.data['body-json'].body))
        .catch((err) => {
          throw err;
        }),
    [],
  );

  const addRoom = useCallback(
    (payload) =>
      axios
        .post(ADD_ROOM, payload, {
          // eslint-disable-next-line no-undef
          headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
        })
        .then((response) => JSON.parse(response.data['body-json'].body))
        .catch((err) => {
          throw err;
        }),
    [],
  );

  const updateRoom = useCallback(
    (id, payload) =>
      axios
        .put(UPDATE_ROOM.replace(':id', id), payload, {
          // eslint-disable-next-line no-undef
          headers: { Authorization: process.env.REACT_APP_AUTHORIZATION_KEY },
        })
        .then((response) => JSON.parse(response.data['body-json'].body))
        .catch((err) => {
          throw err;
        }),
    [],
  );

  return {
    addRoom,
    fetchRoomsByHospitalId,
    updateRoom,
  };
}

export default useRooms;
