// app/api/placeholder/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="50%" y="50%" width="100" height="80" rx="8" 
            fill="#9ca3af" transform="translate(-50, -40)"/>
      <text x="50%" y="60%" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        3D Model
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}