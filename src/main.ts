import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const GH_TOKEN = core.getInput('GH_TOKEN')

    const octokit = github.getOctokit(GH_TOKEN)

    const {
      data: { login },
    } = await octokit.users.getAuthenticated()

    core.debug(login)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
