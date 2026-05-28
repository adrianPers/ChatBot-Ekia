import { io } from 'socket.io-client';

export const socket = io(
  'https://api-eko-production.up.railway.app'
);
