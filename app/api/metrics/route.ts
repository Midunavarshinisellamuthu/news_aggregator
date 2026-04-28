import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics } from 'prom-client';

console.log('Metrics route initialized');

// Initialize default metrics
if (typeof (global as any).prometheusRegistered === 'undefined') {
  collectDefaultMetrics();
  (global as any).prometheusRegistered = true;
}

export async function GET() {
  console.log('GET /api/metrics called');
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (err) {
    console.error('Metrics error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
