import { getInput, setFailed } from '@actions/core'

import { encodeToBase64 } from './encodeToBase64'
import { getCommitMessage } from './getCommitMessage'
import { getContent } from './getContent'
import { getFilename } from './getFilename'
import { getOctokit } from '@actions/github'

export async function run(): Promise<void> {
  try {
    const GH_TOKEN = getInput('GH_TOKEN')

    const repo = getInput('REPO')

    const octokit = getOctokit(GH_TOKEN)

    const {
      data: { login },
    } = await octokit.users.getAuthenticated()

    await octokit.repos.createOrUpdateFileContents({
      content: encodeToBase64(getContent()),
      message: getCommitMessage(),
      owner: login,
      path: `Journal/${getFilename()}.md`,
      repo,
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
