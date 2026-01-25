/**
 * GitHub에서 마크다운 문서를 가져오는 Composable
 *
 * 사용 방법:
 * const { doc, pending, error } = await useGitHubDoc('owner', 'repo', 'docs/sample.md')
 */

import type { GitHubFrontmatter, GitHubDoc } from '~~/app/types/types'

// 프론트매터 파싱
const parseFrontmatter = (markdown: string): [GitHubFrontmatter, string] => {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)

  if (!frontmatterMatch || frontmatterMatch.length < 3) {
    return [{}, markdown]
  }

  const frontmatterStr = frontmatterMatch[1] || ''
  const content = frontmatterMatch[2] || ''
  const frontmatter: GitHubFrontmatter = {}

  // YAML 프론트매터 파싱
  if (frontmatterStr) {
    frontmatterStr.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match && match[1] && match[2]) {
        const key = match[1]
        const value = match[2]
        // 따옴표 제거
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
      }
    })
  }

  return [frontmatter, content.trim()]
}

export const useGitHubDoc = async (
  owner: string,
  repo: string,
  filePath: string,
  branch: string = 'main'
) => {
  const pending = ref(true)
  const error = ref<Error | null>(null)
  const doc = ref<GitHubDoc | null>(null)

  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
    const markdown = await $fetch<string>(rawUrl)

    const [frontmatter, content] = parseFrontmatter(markdown)

    doc.value = {
      title: frontmatter.title || filePath.split('/').pop()?.replace('.md', '') || 'Untitled',
      description: frontmatter.description || '',
      content,
      frontmatter
    }
  } catch (e: any) {
    error.value = new Error(`GitHub 문서 조회 실패: ${e.message}`)
    console.error(error.value)
  } finally {
    pending.value = false
  }

  return {
    doc: readonly(doc),
    pending: readonly(pending),
    error: readonly(error)
  }
}
