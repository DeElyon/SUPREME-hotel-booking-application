import React from 'react';
import { Reservation } from '../../types/reservation';
import { formatUTCDateTime } from '../../utils/dateUtils';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
}

const ReservationDetailsModal: React.FC<Props> = ({ reservation, onClose }) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Reservation Details
          </h3>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Guest Name</label>
                <p className="text-sm text-gray-900">{reservation.guestName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Room Number</label>
                <p className="text-sm text-gray-900">{reservation.roomNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check In</label>
                <p className="text-sm text-gray-900">
                  {formatUTCDateTime(new Date(reservation.checkIn))}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check Out</label>
                <p className="text-sm text-gray-900">
                  {formatUTCDateTime(new Date(reservation.checkOut))}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{reservation.customerEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{reservation.customerPhone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-sm text-gray-900">${reservation.totalAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm text-gray-900">{reservation.status}</p>
              </div>
            </div>
            {reservation.specialRequests && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Special Requests</label>
                <p className="text-sm text-gray-900 mt-1">{reservation.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;