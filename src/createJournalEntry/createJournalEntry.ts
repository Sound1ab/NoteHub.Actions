import { encodeToBase64 } from './encodeToBase64'
import { getCommitMessage } from './getCommitMessage'
import { getContent } from './getContent'
import { getFilename } from './getFilename'
import { getOctokit } from '@actions/github'

interface CreateJournalEntry {
  ghToken: string
  repo: string
}

export async function createJournalEntry({
  ghToken,
  repo,
}: CreateJournalEntry) {
  const octokit = getOctokit(ghToken)

  const {
    data: { login },
  } = await octokit.users.getAuthenticated()

  return octokit.repos.createOrUpdateFileContents({
    content: encodeToBase64(getContent()),
    message: getCommitMessage(),
    owner: login,
    path: `Journal/${getFilename()}.md`,
    repo,
  })
}
