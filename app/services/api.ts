import axios, { AxiosResponse } from 'axios';
import { Reservation, ReservationStatus } from '../types/reservation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotel-booking-app-backend-30q1.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class API {
  // Reservations API
  static async getReservations(vendorId: string, filters?: any): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (vendorId) params.append('vendorId', vendorId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.checkIn) params.append('checkIn', filters.checkIn);
    if (filters?.checkOut) params.append('checkOut', filters.checkOut);
    
    const response: AxiosResponse<Reservation[]> = await apiClient.get(`/api/reservations?${params}`);
    return response.data;
  }

  static async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    const response: AxiosResponse<Reservation> = await apiClient.post('/api/reservations', {
      ...reservation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  static async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    const response: AxiosResponse<Reservation> = await apiClient.patch(`/api/reservations/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  static async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const response: AxiosResponse<Reservation> = await apiClient.patch(`/api/reservations/${id}/status`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  static async deleteReservation(id: string): Promise<void> {
    await apiClient.delete(`/api/reservations/${id}`);
  }

  static async getReservationById(id: string): Promise<Reservation> {
    const response: AxiosResponse<Reservation> = await apiClient.get(`/api/reservations/${id}`);
    return response.data;
  }

  // General API methods
  static async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(endpoint);
    return response.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
    return response.data;
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(endpoint, data);
    return response.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(endpoint);
    return response.data;
  }
}

export default API;
