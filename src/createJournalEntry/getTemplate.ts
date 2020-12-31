import { GitHub } from '@actions/github/lib/utils'

interface GetTemplate {
  octokit: InstanceType<typeof GitHub>
  owner: string
  path: string
  repo: string
}

export async function getTemplate({ octokit, owner, path, repo }: GetTemplate) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      path,
      repo,
    })

    if (!data || Array.isArray(data) || !(data as any).content) {
      return null
    }

    return (data as any).content
  } catch {
    return null
  }
}
