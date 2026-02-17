import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const dataset = searchParams.get('dataset') ?? 'sample'

  // Validate dataset name to prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(dataset)) {
    return NextResponse.json(
      { error: 'Invalid dataset name' },
      { status: 400 }
    )
  }

  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'data',
      'viz',
      `${dataset}.json`
    )
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
  }
}
