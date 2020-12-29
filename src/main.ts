import * as core from '@actions/core'
import * as github from '@actions/github'

import { encodeToBase64 } from './encodeToBase64'

const content = `# ${new Date().toDateString()}`

async function run(): Promise<void> {
  try {
    const GH_TOKEN = core.getInput('GH_TOKEN')

    const octokit = github.getOctokit(GH_TOKEN)

    const {
      data: { login },
    } = await octokit.users.getAuthenticated()

    const filename = new Date().toDateString().replace(/ /gi, '_')

    await octokit.repos.createOrUpdateFileContents({
      content: encodeToBase64(content),
      message: `note(create file): Journal - ${new Date().toDateString()}`,
      owner: login,
      path: `Journal/${filename}.md`,
      repo: 'NoteHub.Notebook',
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
