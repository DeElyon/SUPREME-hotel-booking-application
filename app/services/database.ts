import { Reservation, ReservationStatus } from '../types/reservation';

// This simulates a database service - replace with actual database operations
class DatabaseService {
  private static instance: DatabaseService;
  private reservations: Map<string, Reservation> = new Map();

  private constructor() {
    // Initialize with some mock data
    this.seedInitialData();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private seedInitialData() {
    const mockReservations: Reservation[] = [
      {
        id: '1',
        guestName: 'John Doe',
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        roomNumber: '101',
        status: 'confirmed',
        totalAmount: 150,
        customerEmail: 'john.doe@example.com',
        customerPhone: '+1234567890',
        specialRequests: 'Late check-in requested',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        guestName: 'Jane Smith',
        checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        roomNumber: '205',
        status: 'pending',
        totalAmount: 200,
        customerEmail: 'jane.smith@example.com',
        customerPhone: '+1234567891',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        guestName: 'Bob Wilson',
        checkIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        roomNumber: '307',
        status: 'checked-in',
        totalAmount: 300,
        customerEmail: 'bob.wilson@example.com',
        customerPhone: '+1234567892',
        specialRequests: 'Ocean view room',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockReservations.forEach(reservation => {
      this.reservations.set(reservation.id, reservation);
    });
  }

  // CRUD Operations
  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newReservation: Reservation = {
      ...reservation,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async getReservations(filters?: {
    vendorId?: string;
    status?: ReservationStatus;
    checkIn?: string;
    checkOut?: string;
  }): Promise<Reservation[]> {
    let results = Array.from(this.reservations.values());

    if (filters?.status) {
      results = results.filter(r => r.status === filters.status);
    }

    if (filters?.checkIn) {
      results = results.filter(r => 
        new Date(r.checkIn) >= new Date(filters.checkIn!)
      );
    }

    if (filters?.checkOut) {
      results = results.filter(r => 
        new Date(r.checkOut) <= new Date(filters.checkOut!)
      );
    }

    // Sort by creation date (newest first)
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    return this.reservations.get(id) || null;
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const existing = this.reservations.get(id);
    if (!existing) return null;

    const updated: Reservation = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.reservations.set(id, updated);
    return updated;
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    return this.updateReservation(id, { status });
  }

  async deleteReservation(id: string): Promise<boolean> {
    return this.reservations.delete(id);
  }

  // Utility methods
  async getTodayReservations(): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    const reservations = await this.getReservations();
    
    return reservations.filter(r => 
      r.checkIn.startsWith(today) || r.checkOut.startsWith(today)
    );
  }

  async getReservationsByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return this.getReservations({ status });
  }

  async getUpcomingReservations(days: number = 7): Promise<Reservation[]> {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const reservations = await this.getReservations();
    
    return reservations.filter(r => 
      new Date(r.checkIn) <= new Date(futureDate) &&
      new Date(r.checkIn) >= new Date()
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Real-time subscriptions simulation
  private subscribers: ((reservation: Reservation, action: 'create' | 'update' | 'delete') => void)[] = [];

  subscribe(callback: (reservation: Reservation, action: 'create' | 'update' | 'delete') => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(reservation: Reservation, action: 'create' | 'update' | 'delete') {
    this.subscribers.forEach(callback => callback(reservation, action));
  }

  // Override methods to include notifications
  async createReservationWithNotification(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    const created = await this.createReservation(reservation);
    this.notifySubscribers(created, 'create');
    return created;
  }

  async updateReservationWithNotification(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const updated = await this.updateReservation(id, updates);
    if (updated) {
      this.notifySubscribers(updated, 'update');
    }
    return updated;
  }

  async deleteReservationWithNotification(id: string): Promise<boolean> {
    const reservation = this.reservations.get(id);
    const deleted = await this.deleteReservation(id);
    if (deleted && reservation) {
      this.notifySubscribers(reservation, 'delete');
    }
    return deleted;
  }
}

export default DatabaseService.getInstance();
