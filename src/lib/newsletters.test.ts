/**
 * @jest-environment node
 */

function makeNewsletterFile(overrides: Record<string, unknown> = {}): string {
  const fields = {
    id: 'nl-1',
    title: 'April Recap',
    slug: '2026-04-cpw-recap',
    date: '2026-04-30',
    period: 'April 2026',
    status: 'published',
    ...overrides,
  }
  const frontmatter = Object.entries(fields)
    .map(([k, v]) => `${k}: "${v}"`)
    .join('\n')
  return `---\n${frontmatter}\n---\n\nNewsletter body.`
}

function withNewsletters<T>(
  fsMocks: {
    existsSync?: boolean
    files?: string[]
    fileContents?: string | string[]
  },
  run: (mod: typeof import('./newsletters')) => T
): T {
  let result!: T
  jest.isolateModules(() => {
    const { existsSync = true, files = [], fileContents = '' } = fsMocks
    const contents = Array.isArray(fileContents) ? fileContents : [fileContents]
    let callCount = 0

    jest.mock('fs', () => ({
      existsSync: jest.fn().mockReturnValue(existsSync),
      readdirSync: jest.fn().mockReturnValue(files),
      readFileSync: jest.fn().mockImplementation(() => contents[callCount++ % contents.length] ?? ''),
    }))

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('./newsletters') as typeof import('./newsletters')
    result = run(mod)
  })
  return result
}

describe('getPublishedNewsletters', () => {
  it('returns published newsletters sorted newest first', () => {
    const results = withNewsletters(
      {
        files: ['2026-03-cpw-recap.md', '2026-04-cpw-recap.md'],
        fileContents: [
          makeNewsletterFile({ date: '2026-03-31', slug: '2026-03-cpw-recap', period: 'March 2026' }),
          makeNewsletterFile({ date: '2026-04-30', slug: '2026-04-cpw-recap', period: 'April 2026' }),
        ],
      },
      (m) => m.getPublishedNewsletters()
    )
    expect(results).toHaveLength(2)
    expect(results[0].date).toBe('2026-04-30')
    expect(results[1].date).toBe('2026-03-31')
  })

  it('excludes draft newsletters', () => {
    const results = withNewsletters(
      {
        files: ['2026-04-cpw-recap.md', '2026-05-cpw-draft.md'],
        fileContents: [
          makeNewsletterFile({ slug: '2026-04-cpw-recap', status: 'published' }),
          makeNewsletterFile({ slug: '2026-05-cpw-draft', status: 'draft' }),
        ],
      },
      (m) => m.getPublishedNewsletters()
    )
    expect(results).toHaveLength(1)
    expect(results[0].slug).toBe('2026-04-cpw-recap')
  })

  it('returns empty array when directory does not exist', () => {
    const results = withNewsletters({ existsSync: false }, (m) => m.getPublishedNewsletters())
    expect(results).toEqual([])
  })
})

describe('getNewsletterBySlug', () => {
  it('returns full newsletter with content for a known slug', async () => {
    let newsletter: Awaited<ReturnType<typeof import('./newsletters').getNewsletterBySlug>>
    await new Promise<void>((resolve) => {
      jest.isolateModules(async () => {
        jest.mock('fs', () => ({
          existsSync: jest.fn().mockReturnValue(true),
          readdirSync: jest.fn().mockReturnValue(['2026-04-cpw-recap.md']),
          readFileSync: jest.fn().mockReturnValue(makeNewsletterFile()),
        }))
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('./newsletters') as typeof import('./newsletters')
        newsletter = await mod.getNewsletterBySlug('2026-04-cpw-recap')
        resolve()
      })
    })
    expect(newsletter).toBeDefined()
    expect(newsletter?.period).toBe('April 2026')
    expect(newsletter?.content).toContain('Newsletter body.')
  })

  it('returns undefined for an unknown slug', async () => {
    let newsletter: Awaited<ReturnType<typeof import('./newsletters').getNewsletterBySlug>>
    await new Promise<void>((resolve) => {
      jest.isolateModules(async () => {
        jest.mock('fs', () => ({
          existsSync: jest.fn().mockReturnValue(true),
          readdirSync: jest.fn().mockReturnValue([]),
          readFileSync: jest.fn().mockReturnValue(''),
        }))
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('./newsletters') as typeof import('./newsletters')
        newsletter = await mod.getNewsletterBySlug('does-not-exist')
        resolve()
      })
    })
    expect(newsletter).toBeUndefined()
  })
})
