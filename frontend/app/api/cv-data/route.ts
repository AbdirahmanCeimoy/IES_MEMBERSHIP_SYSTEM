import { NextResponse } from 'next/server';

const SHEET_ID = '1DH1Wvue3mDJdUQUgFYrLTluqgRauZK_Q5x6aGBCp_sY';
const GID = '2034401170';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch spreadsheet data. The spreadsheet may not be publicly accessible.' },
        { status: 502 },
      );
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'The spreadsheet is not publicly accessible. Please share it with "Anyone with the link".' },
        { status: 403 },
      );
    }

    const csv = await res.text();
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch CV data' }, { status: 500 });
  }
}
