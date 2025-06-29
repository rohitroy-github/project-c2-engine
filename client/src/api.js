import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

export const createUser = (name) => API.post('/user', { username: name });
export const fetchStatus = (name) => API.get(`/status/${name}`);
export const makeTrade = (data) => API.post('/trade', data);
export const fetchLeaderboard = () => API.get('/leaderboard');
