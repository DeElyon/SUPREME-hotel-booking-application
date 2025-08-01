import { NextRequest, NextResponse } from 'next/server';
import { Reservation } from '../../../types/reservation';

// This would connect to your actual database
// For now, using same in-memory store reference
declare global {
  var reservationsStore: Reservation[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In real app, query database
    const reservation = global.reservationsStore?.find(r => r.id === id);
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    if (!global.reservationsStore) {
      global.reservationsStore = [];
    }
    
    const reservationIndex = global.reservationsStore.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    global.reservationsStore[reservationIndex] = {
      ...global.reservationsStore[reservationIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Simulate real-time broadcast
    if (global.io) {
      global.io.emit('reservation:update', {
        type: 'update',
        data: global.reservationsStore[reservationIndex],
      });
    }

    return NextResponse.json(global.reservationsStore[reservationIndex]);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!global.reservationsStore) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }
    
    const reservationIndex = global.reservationsStore.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    const deletedReservation = global.reservationsStore[reservationIndex];
    global.reservationsStore.splice(reservationIndex, 1);

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
