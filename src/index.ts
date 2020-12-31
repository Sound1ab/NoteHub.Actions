import { getInput, setFailed } from '@actions/core'

import { COMMANDS } from './enums'
import { createJournalEntry } from './createJournalEntry/createJournalEntry'

export async function run() {
  try {
    switch (getInput('COMMAND')) {
      case COMMANDS.CREATE_JOURNAL_ENTRY:
        return createJournalEntry()
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
