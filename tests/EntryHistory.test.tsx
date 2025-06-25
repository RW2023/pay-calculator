import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EntryHistory from '@/components/EntryHistory'

const entries = [
  {
    _id: '1',
    days: [],
    hasPension: false,
    hasUnionDues: false,
    createdAt: new Date().toISOString(),
  },
]

declare global {
  // eslint-disable-next-line no-var
  var fetch: jest.Mock
}

describe('EntryHistory', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (options && (options as RequestInit).method === 'DELETE') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(entries) })
    }) as unknown as jest.Mock
    window.confirm = jest.fn(() => true)
  })

  it('deletes an entry when confirmed', async () => {
    render(<EntryHistory />)
    await screen.findByText(/saved pay weeks/i)
    const deleteButton = screen.getByRole('button', { name: /delete entry/i })
    await userEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalled()
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/entries/1', {
        method: 'DELETE',
      })
    })
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /delete entry/i })).toBeNull()
    })
  })
})
