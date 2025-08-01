import { NextResponse } from 'next/server';

export async function GET() {
  // Temporary stub - return empty array
  return NextResponse.json([]);
}

export async function POST() {
  // Temporary stub - return success
  return NextResponse.json({ success: true, message: 'Branch created' }, { status: 201 });
}
