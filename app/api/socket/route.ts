// app/api/socket/route.ts
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    let io;

    if (!(global as any).io) {
      io = new SocketIOServer((global as any).server, {
        path: '/api/socket',
      });
      (global as any).io = io;
    } else {
      io = (global as any).io;
    }

    return NextResponse.json({
      success: true,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
      },
    });
  } catch (error) {
    console.error('Socket setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to setup socket' },
      { status: 500 }
    );
  }
}