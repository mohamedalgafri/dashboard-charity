// lib/socket.ts
import { Socket, io } from 'socket.io-client';

let socket: Socket;

export const initSocket = async () => {
  await fetch('/api/socket');
  
  if (!socket) {
    socket = io({
      path: '/api/socket',
    });

    // إعداد الأحداث الأساسية
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const getSocket = () => socket;