import { createJournalEntry } from '../createJournalEntry'
import { encodeToBase64 } from '../encodeToBase64'
import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'
import { mockDate } from '../../testUtils'

jest.mock('@actions/core')
jest.mock('@actions/github')

describe('createJournalEntry', () => {
  mockDate('May 1, 2020 12:00:00')

  const createOrUpdateFileContents = jest.fn()

  const content = encodeToBase64(`## mock header
  
  some mock content
  
  ## another mock heading
  `)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getInput as jest.Mock).mockImplementation((input: string) => {
      switch (input) {
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
        getContent: () => ({ data: { content } }),
      },
    }))
  })

  it('should call createOrUpdateFileContents', async () => {
    await createJournalEntry()

    expect(createOrUpdateFileContents).toBeCalledWith({
      content:
        'IyBGcmkgTWF5IDAxIDIwMjAKICAKICAjIyBtb2NrIGhlYWRlcgogIAogIHNvbWUgbW9jayBjb250ZW50CiAgCiAgIyMgYW5vdGhlciBtb2NrIGhlYWRpbmcKICAKICA=',
      message: 'note(create file): Journal - Fri May 01 2020',
      owner: 'MOCK_LOGIN',
      path: 'ROOT_DIR/202041-Fri_May_01_2020.md',
      repo: 'REPO',
    })
  })

  it.each(['GH_TOKEN', 'REPO', 'ROOT_DIR'])(
    'should throw an error if %s is missing',
    async missingInput => {
      ;(getInput as jest.Mock).mockImplementation((input: string) => {
        switch (input) {
          case missingInput:
            return undefined
          default:
            return input
        }
      })

      await expect(createJournalEntry()).rejects.toThrow('Some inputs missing')
    }
  )

  it.each([null, [], { content: undefined }])(
    'should throw an error if data is %s',
    async data => {
      ;(getOctokit as jest.Mock).mockImplementation(() => ({
        users: {
          getAuthenticated: () => ({ data: { login: 'MOCK_LOGIN' } }),
        },
        repos: {
          createOrUpdateFileContents,
          getContent: () => ({ data }),
        },
      }))

      await expect(createJournalEntry()).rejects.toThrow('Template not found')
    }
  )
})
