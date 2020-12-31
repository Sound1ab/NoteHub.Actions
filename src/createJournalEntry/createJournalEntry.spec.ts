import { getInput, setFailed } from '@actions/core'

import { getOctokit } from '@actions/github'
import { mockDate } from '../testUtils'
import { run } from './createJournalEntry'

jest.mock('@actions/core')
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
    ;(getInput as jest.Mock).mockImplementation(() => 'MOCK_GH_TOKEN')
  })

  it('should call createOrUpdateFileContents', async () => {
    await run()

    expect(createOrUpdateFileContents).toBeCalledWith({
      content: 'IyBGcmkgTWF5IDAxIDIwMjA=',
      message: 'note(create file): Journal - Fri May 01 2020',
      owner: 'MOCK_LOGIN',
      path: 'Journal/2020/4/1-Fri_May_01_2020.md',
      repo: 'MOCK_GH_TOKEN',
    })
  })

  it('should call setFailed if an error is thrown', async () => {
    ;(getInput as jest.Mock).mockImplementation(() => {
      throw new Error('error')
    })

    await run()

    expect(setFailed).toBeCalledWith('error')
  })
})
