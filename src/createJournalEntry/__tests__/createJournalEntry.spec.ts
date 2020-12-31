import { COMMANDS } from '../../enums'
import { createJournalEntry } from '../createJournalEntry'
import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'
import { mockDate } from '../../testUtils'

jest.mock('@actions/core')
jest.mock('@actions/github')

describe('createJournalEntry', () => {
  mockDate('May 1, 2020 12:00:00')

  const createOrUpdateFileContents = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getInput as jest.Mock).mockImplementation((input: string) => {
      switch (input) {
        case 'COMMAND':
          return COMMANDS.CREATE_JOURNAL_ENTRY
        default:
          return input
      }
    })
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
    await createJournalEntry()

    expect(createOrUpdateFileContents).toBeCalledWith({
      content: 'IyBGcmkgTWF5IDAxIDIwMjA=',
      message: 'note(create file): Journal - Fri May 01 2020',
      owner: 'MOCK_LOGIN',
      path: 'ROOT_DIR/202041-Fri_May_01_2020.md',
      repo: 'REPO',
    })
  })
})
