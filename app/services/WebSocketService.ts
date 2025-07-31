import { io, Socket } from 'socket.io-client';
import { ReservationUpdate } from '../types/reservation';

class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;
  private readonly BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://hotel-booking-app-backend-30q1.onrender.com';

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(token: string): void {
    if (this.socket) return;

    this.socket = io(this.BASE_URL, {
      auth: { token },
      query: { role: "vendor" },
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket Connected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket Connection Error:', error);
    });
  }

  public subscribeToReservations(callback: (update: ReservationUpdate) => void): void {
    if (!this.socket) throw new Error('WebSocket not connected');
    
    this.socket.on('reservation:update', callback);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default WebSocketService.getInstance();