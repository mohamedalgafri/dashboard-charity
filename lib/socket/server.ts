// lib/socket/server.ts
import { Server as NetServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketServer(httpServer, {
      path: '/api/socket',
    });
    res.socket.server.io = io;
  }
  res.end();
}