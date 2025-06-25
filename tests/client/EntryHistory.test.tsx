import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EntryHistory from '@/components/EntryHistory'

describe('EntryHistory', () => {
  const entries = [
    { _id: '1', days: [], hasPension: false, hasUnionDues: false, createdAt: new Date().toISOString() },
    { _id: '2', days: [], hasPension: false, hasUnionDues: false, createdAt: new Date().toISOString() },
  ]

  beforeEach(() => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => entries })
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) }) as any
    jest.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    ;(global.fetch as jest.Mock).mockReset()
    jest.restoreAllMocks()
  })

  it('calls DELETE and updates list', async () => {
    render(<EntryHistory />)

    await screen.findByText(/saved pay weeks/i)
    const buttons = screen.getAllByRole('button', { name: /delete entry/i })
    await userEvent.click(buttons[0])

    expect(window.confirm).toHaveBeenCalled()
    expect(global.fetch).toHaveBeenLastCalledWith('/api/entries/1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /delete entry/i })).toHaveLength(1)
    })
  })
})
