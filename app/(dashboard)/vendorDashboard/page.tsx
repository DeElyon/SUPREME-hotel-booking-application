import React, { useState, useCallback, Suspense } from 'react';
import { useReservations } from '../../../hooks/useReservations';
import ReservationsTable from '../../../components/dashboard/ReservationsTable';
import ReservationDetailsModal from '../../../components/dashboard/ReservationDetailsModal';
import { DashboardStats } from '@/app/components/DashboardStats';
import { Overview } from '@/app/components/Overview';
import { RecentOrders } from '@/app/components/RecentOrders';
import { TopSellingItems } from '@/app/components/TopSellingItems';
import { MenuCard } from '@/app/components/MenuCard';
import { Reservation } from '../../../types/reservation';
import { API } from '../../../services/api';
import CurrentDateTime from '../../../components/dashboard/CurrentDateTime';

const VendorDashboard: React.FC = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const vendorId = 'current-vendor-id'; // Replace with actual vendor ID
  const { items: reservations, loading, error } = useReservations(vendorId);

  const handleStatusChange = useCallback(async (id: string, status: Reservation['status']) => {
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      // WebSocket will handle the update in the UI
    } catch (error) {
      console.error('Failed to update reservation status:', error);
      // Handle error (show notification, etc.)
    }
  }, []);

  const handleViewDetails = useCallback((reservation: Reservation) => {
    setSelectedReservation(reservation);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p>Error loading reservations: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header with DateTime and User Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <div className="flex items-center space-x-4">
            <CurrentDateTime />
            <div className="text-sm text-gray-600">
              User: DeElyon
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                className="aspect-video animate-pulse rounded-xl bg-gray-100"
                key={i}
              />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Overview and Menu Card */}
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <Overview />
        </Suspense>
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <MenuCard />
        </Suspense>
      </div>

      {/* Real-time Reservations */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Real-time Reservations</h2>
            <ReservationsTable
              reservations={reservations}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Selling Items */}
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <RecentOrders />
        </Suspense>
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <TopSellingItems />
        </Suspense>
      </div>

      {/* Reservation Details Modal */}
      <ReservationDetailsModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default VendorDashboard;