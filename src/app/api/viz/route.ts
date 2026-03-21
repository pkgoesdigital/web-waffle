import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { readFileSync } from 'fs'
import path from 'path'

const VIZ_DIR = path.resolve(process.cwd(), 'src', 'data', 'viz')

// Cache each dataset's parsed JSON for 1 hour across requests
const getCachedVizData = unstable_cache(
  async (dataset: string) => {
    const filePath = path.resolve(VIZ_DIR, `${dataset}.json`)
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as unknown
  },
  ['viz-data'],
  { revalidate: 3600 }
)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const dataset = searchParams.get('dataset') ?? 'sample'

  // Validate dataset name (allowlist characters)
  if (!/^[a-zA-Z0-9_-]+$/.test(dataset)) {
    return NextResponse.json({ error: 'Invalid dataset name' }, { status: 400 })
  }

  // Defense-in-depth: confirm resolved path stays within the viz directory
  const resolved = path.resolve(VIZ_DIR, `${dataset}.json`)
  if (!resolved.startsWith(VIZ_DIR + path.sep)) {
    return NextResponse.json({ error: 'Invalid dataset name' }, { status: 400 })
  }

  try {
    const data = await getCachedVizData(dataset)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
  }
}
