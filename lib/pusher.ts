// lib/pusher.ts
import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: "1917924",
  key: "f063188ede4c0122911d",
  secret: "a328ce10ace95c6b5094",
  cluster: "ap2",
  useTLS: true
})

export const pusherClient = new PusherClient("f063188ede4c0122911d", {
  cluster: "ap2"
})