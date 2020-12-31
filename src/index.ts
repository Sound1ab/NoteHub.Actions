import { getInput, setFailed } from '@actions/core'

import { COMMANDS } from './enums'
import { createJournalEntry } from './createJournalEntry/createJournalEntry'

export async function run() {
  try {
    const GH_TOKEN = getInput('GH_TOKEN')

    const REPO = getInput('REPO')

    if (!GH_TOKEN) throw new Error('GitHub token not found')

    if (!REPO) throw new Error('Repo not found')

    switch (getInput('COMMAND')) {
      case COMMANDS.CREATE_JOURNAL_ENTRY:
        return createJournalEntry({ ghToken: GH_TOKEN, repo: REPO })
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
