/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from './route'

function makeRequest(password: string, from?: string): NextRequest {
  const formData = new FormData()
  formData.append('password', password)
  if (from) formData.append('from', from)

  return new NextRequest('http://localhost/api/cpw-auth', {
    method: 'POST',
    body: formData,
  })
}

describe('POST /api/cpw-auth', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, CPW_PASSWORD: 'secret123' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('sets auth cookie and redirects on correct password', async () => {
    const req = makeRequest('secret123')
    const res = await POST(req)

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toContain('/cpw-neighborhood-watch')
    expect(res.headers.get('set-cookie')).toContain('cpw-auth=true')
  })

  it('redirects to login with error on wrong password', async () => {
    const req = makeRequest('wrongpassword')
    const res = await POST(req)

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toContain('/cpw-neighborhood-watch/login')
    expect(res.headers.get('location')).toContain('error=1')
  })

  it('redirects to "from" path on success when valid', async () => {
    const req = makeRequest('secret123', '/cpw-neighborhood-watch/calendar')
    const res = await POST(req)

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toContain('/cpw-neighborhood-watch/calendar')
  })

  it('ignores "from" paths outside the cpw section', async () => {
    const req = makeRequest('secret123', '/about')
    const res = await POST(req)

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).not.toContain('/about')
    expect(res.headers.get('location')).toContain('/cpw-neighborhood-watch')
  })
})
