import * as core from '@actions/core'
import * as github from '@actions/github'

import { encodeToBase64 } from './encodeToBase64'
import { getCommitMessage } from './getCommitMessage'
import { getContent } from './getContent'
import { getFilename } from './getFilename'

async function run(): Promise<void> {
  try {
    const GH_TOKEN = core.getInput('GH_TOKEN')

    const repo = core.getInput('REPO')

    const octokit = github.getOctokit(GH_TOKEN)

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
    core.setFailed(error.message)
  }
}

run()
