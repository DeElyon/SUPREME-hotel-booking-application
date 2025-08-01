import { NextRequest, NextResponse } from 'next/server';
import { Reservation, ReservationStatus } from '../../types/reservation';
import DatabaseService from '../../services/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status') as ReservationStatus;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const filters = {
      vendorId: vendorId || undefined,
      status: status || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
    };

    const reservations = await DatabaseService.getReservations(filters);
    return NextResponse.json(reservations);
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

    const newReservation = await DatabaseService.createReservationWithNotification(body);

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

    const updatedReservation = await DatabaseService.updateReservationWithNotification(id, updates);

    if (!updatedReservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Simulate real-time broadcast
    if (global.io) {
      global.io.emit('reservation:update', {
        type: 'update',
        data: updatedReservation,
      });
    }

    return NextResponse.json(updatedReservation);
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
