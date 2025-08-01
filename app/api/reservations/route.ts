import { NextRequest, NextResponse } from 'next/server';
import { Reservation, ReservationStatus } from '../../types/reservation';

// In-memory store for demo (replace with actual database)
let reservations: Reservation[] = [
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
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    let filteredReservations = reservations;

    // Apply filters
    if (status) {
      filteredReservations = filteredReservations.filter(r => r.status === status);
    }
    if (checkIn) {
      filteredReservations = filteredReservations.filter(r => 
        new Date(r.checkIn) >= new Date(checkIn)
      );
    }
    if (checkOut) {
      filteredReservations = filteredReservations.filter(r => 
        new Date(r.checkOut) <= new Date(checkOut)
      );
    }

    return NextResponse.json(filteredReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reservations.push(newReservation);

    // Simulate real-time broadcast (in real app, use WebSocket)
    if (global.io) {
      global.io.emit('reservation:update', {
        type: 'new',
        data: newReservation,
      });
    }

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const reservationIndex = reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Simulate real-time broadcast
    if (global.io) {
      global.io.emit('reservation:update', {
        type: 'update',
        data: reservations[reservationIndex],
      });
    }

    return NextResponse.json(reservations[reservationIndex]);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    const reservationIndex = reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    const deletedReservation = reservations[reservationIndex];
    reservations.splice(reservationIndex, 1);

    // Simulate real-time broadcast
    if (global.io) {
      global.io.emit('reservation:update', {
        type: 'delete',
        data: deletedReservation,
      });
    }

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
