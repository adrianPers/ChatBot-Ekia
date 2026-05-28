import { io } from 'socket.io-client';

export const socket = io(
  'api-eko-production.up.railway.app'
);