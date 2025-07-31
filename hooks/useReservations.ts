import { useState, useEffect, useCallback } from 'react';
import { Reservation, ReservationStatus, ReservationUpdate, ReservationsState } from '@/types/reservation';
import WebSocketService from '../services/WebSocketService';
import { fetcher } from '@/utils/api';
import useSWR from 'swr';

interface ReservationFilters {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface UseReservationsReturn extends ReservationsState {
  mutate: () => Promise<void>;
  currentTime: string;
  userLogin: string;
}

function buildQuery(filters: ReservationFilters, vendorId: string) {
  const params = new URLSearchParams();
  params.append("vendorId", vendorId);
  if (filters.status) params.append("status", filters.status);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  return params.toString();
}

export const useReservations = (
  vendorId: string,
  filters: ReservationFilters = {}
): UseReservationsReturn => {
  const [currentTime, setCurrentTime] = useState(getCurrentUTCDateTime());
  const [state, setState] = useState<ReservationsState>({
    items: [],
    loading: true,
    error: null,
  });

  // SWR Integration
  const query = buildQuery(filters, vendorId);
  const { data, error, isLoading, mutate } = useSWR<Reservation[]>(
    `/api/reservations?${query}`,
    fetcher
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentUTCDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle real-time updates
  const handleReservationUpdate = useCallback((update: ReservationUpdate) => {
    setState(prev => {
      switch (update.type) {
        case 'new':
          return {
            ...prev,
            items: [update.data, ...prev.items],
          };
        case 'update':
          return {
            ...prev,
            items: prev.items.map(item => 
              item.id === update.data.id ? update.data : item
            ),
          };
        case 'delete':
          return {
            ...prev,
            items: prev.items.filter(item => item.id !== update.data.id),
          };
        default:
          return prev;
      }
    });
    // Revalidate SWR cache after websocket update
    mutate();
  }, [mutate]);

  // Setup WebSocket connection
  useEffect(() => {
    WebSocketService.connect();
    WebSocketService.subscribeToReservations(handleReservationUpdate);

    return () => {
      WebSocketService.disconnect();
    };
  }, [handleReservationUpdate]);

  // Update state when SWR data changes
  useEffect(() => {
    if (data) {
      setState(prev => ({
        ...prev,
        items: data,
        loading: false,
        error: null,
      }));
    }
    if (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch reservations',
        loading: false,
      }));
    }
  }, [data, error]);

  return {
    ...state,
    mutate,
    currentTime,
    userLogin: 'DeElyon',
    loading: isLoading || state.loading,
  };
};

// Utility function for formatting current UTC time
function getCurrentUTCDateTime(): string {
  const now = new Date();
  return now.toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '');
}