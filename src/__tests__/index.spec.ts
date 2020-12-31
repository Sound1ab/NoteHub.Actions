import { getInput, setFailed } from '@actions/core'

import { COMMANDS } from '../enums'
import { createJournalEntry } from '../createJournalEntry/createJournalEntry'
import { mockDate } from '../testUtils'
import { run } from '../index'

jest.mock('@actions/core')
jest.mock('../createJournalEntry/createJournalEntry')

describe('createJournalEntry', () => {
  mockDate('May 1, 2020 12:00:00')

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
  })

  it('should call createJournalEntry if command', async () => {
    await run()

    expect(createJournalEntry).toBeCalledWith({
      ghToken: 'GH_TOKEN',
      repo: 'REPO',
    })
  })

  it('should call setFailed if an error is thrown', async () => {
    ;(createJournalEntry as jest.Mock).mockImplementation(() => {
      throw new Error('error')
    })

    await run()

    expect(setFailed).toBeCalledWith('error')
  })
})
