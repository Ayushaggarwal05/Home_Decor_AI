import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'Aura AI Spatial Diagnostics Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    env: process.env.NODE_ENV
  });
}
