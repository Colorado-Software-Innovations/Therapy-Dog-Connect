// eslint-disable-next-line no-undef
const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;
/**
 * Address Service
 */
export const FETCH_ADDRESS_BY_ID = `${BASE_URL}/address/:id`;
export const ADD_ADDRESS = `${BASE_URL}/address`;
export const DELETE_ADDRESS = `${BASE_URL}/address/:id`;
export const UPDATE_ADDRESS = `${BASE_URL}/address/:id`;
/**
 * Room Service
 */
export const FETCH_ROOM_BY_HOSPITAL_ID = `${BASE_URL}/room?venue_id=:id`;
export const ADD_ROOM = `${BASE_URL}/room`;
export const UPDATE_ROOM = `${BASE_URL}/room/:id`;

/**
 * Visits Service
 */

export const ADD_VISIT = `${BASE_URL}/visits/`;
export const FETCH_VISIT_BY_HOSPITAL_ID = `${BASE_URL}/visit?venue_id=:id`;
export const QR_URL = `http://localhost:3000/visit/hospitals/:id`;

/**
 * Venue (Hospital) Service
 */

export const FETCH_ALL_VENUES = `${BASE_URL}/venue`;
export const FETCH_VENUE_BY_ID = `${BASE_URL}/venue?id=:id`;
export const UPDATE_VENUE = `${BASE_URL}/venue/:id`;
export const DELETE_VENUE = `${BASE_URL}/venue/:id`;
export const ADD_VENUE = `${BASE_URL}/venue`;

/**
 * Person Service
 */
export const ADD_PERSON = `${BASE_URL}/user`;
export const DELETE_PERSON = `${BASE_URL}/user/:id`;
export const UPDATE_PERSON = `${BASE_URL}/user/:id`;
export const GET_USERS_BY_VENUE_ID = `${BASE_URL}/user?venue_id=:id`;

/**
 * Volunteer Type Service
 */
export const ADD_VOLUNTEER_TYPE = `${BASE_URL}/volunteer-types`;
export const FETCH_VOLUNTEER_TYPES = `${BASE_URL}/volunteer-types`;
export const UPDATE_VOLUNTEER_TYPES = `${BASE_URL}/volunteer-types/:id`;
