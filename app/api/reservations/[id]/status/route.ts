import { NextRequest, NextResponse } from 'next/server';
import { ReservationStatus } from '../../../../types/reservation';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // Validate status
    const validStatuses: ReservationStatus[] = [
      'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'
    ];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
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

    // Update status
    global.reservationsStore[reservationIndex] = {
      ...global.reservationsStore[reservationIndex],
      status,
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
    console.error('Error updating reservation status:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation status' },
      { status: 500 }
    );
  }
}
