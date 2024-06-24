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
export const FETCH_ROOM_BY_HOSPITAL_ID = `${BASE_URL}/rooms/hospital/:id`;
export const ADD_ROOM = `${BASE_URL}/rooms/`;

/**
 * Visits Service
 */

export const ADD_VISIT = `${BASE_URL}/visits/`;
export const FETCH_VISIT_BY_HOSPITAL_ID = `${BASE_URL}/visits/hospital/:id`;
export const QR_URL = `http://localhost:3000/visit/hospitals/:id`;

/**
 * Venue (Hospital) Service
 */

export const FETCH_ALL_VENUES = `${BASE_URL}/venues`;
export const FETCH_VENUE_BY_ID = `${BASE_URL}/venues/:id`;
export const UPDATE_VENUE = `${BASE_URL}/venues/:id`;
export const DELETE_VENUE = `${BASE_URL}/venues/:id`;
export const ADD_VENUE = `${BASE_URL}/venues`;

/**
 * Person Service
 */
export const ADD_PERSON = `${BASE_URL}/person`;
export const DELETE_PERSON = `${BASE_URL}/person/:id`;
export const UPDATE_PERSON = `${BASE_URL}/person/:id`;
