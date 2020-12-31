import { createJournalEntry } from '../createJournalEntry'
import { getOctokit } from '@actions/github'
import { mockDate } from '../../testUtils'

jest.mock('@actions/github')

describe('createJournalEntry', () => {
  mockDate('May 1, 2020 12:00:00')

  const createOrUpdateFileContents = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getOctokit as jest.Mock).mockImplementation(() => ({
      users: {
        getAuthenticated: () => ({ data: { login: 'MOCK_LOGIN' } }),
      },
      repos: {
        createOrUpdateFileContents,
      },
    }))
  })

  it('should call createOrUpdateFileContents', async () => {
    await createJournalEntry({ ghToken: 'MOCK_TOKEN', repo: 'MOCK_REPO' })

    expect(createOrUpdateFileContents).toBeCalledWith({
      content: 'IyBGcmkgTWF5IDAxIDIwMjA=',
      message: 'note(create file): Journal - Fri May 01 2020',
      owner: 'MOCK_LOGIN',
      path: 'Journal/2020/4/1-Fri_May_01_2020.md',
      repo: 'MOCK_REPO',
    })
  })
})
