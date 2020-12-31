import { decodeFromBase64 } from './decodeFromBase64'
import { encodeToBase64 } from './encodeToBase64'
import { getCommitMessage } from './getCommitMessage'
import { getFileHeader } from './getFileHeader'
import { getFilename } from './getFilename'
import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'

export async function createJournalEntry() {
  const GH_TOKEN = getInput('GH_TOKEN')
  const REPO = getInput('REPO')
  const ROOT_DIR = getInput('ROOT_DIR')

  if (!GH_TOKEN || !REPO || !ROOT_DIR) throw new Error('Some inputs missing')

  const octokit = getOctokit(GH_TOKEN)

  const {
    data: { login },
  } = await octokit.users.getAuthenticated()

  const { data } = await octokit.repos.getContent({
    owner: login,
    path: `${ROOT_DIR}/template.md`,
    repo: REPO,
  })

  if (!data || Array.isArray(data) || !(data as any).content) {
    throw new Error('Template not found')
  }

  const template = decodeFromBase64((data as any).content)

  const content = `${getFileHeader()}
  
  ${template}
  `

  return octokit.repos.createOrUpdateFileContents({
    content: encodeToBase64(content),
    message: getCommitMessage(),
    owner: login,
    path: `${ROOT_DIR}/${getFilename()}.md`,
    repo: REPO,
  })
}
