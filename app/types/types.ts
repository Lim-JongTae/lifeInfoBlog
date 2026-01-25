// 카테고리
export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  sortOrder: number
  _count?: {
    posts: number
  }
}

// 게시글
export interface Post {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  categoryId: string
  category: Category
  tags: string[]
  published: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

// 게시글 목록 응답
export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  ActiveId?: string | null
  level?: number
}

// 게시글 조회 파라미터
export interface PostQueryParams {
  category?: string
  page?: number
  limit?: number
  search?: string
}

export interface GitHubFrontmatter {
  title?: string
  description?: string
  [key: string]: any
}

export interface GitHubDoc {
  title: string
  description?: string
  content: string
  frontmatter: GitHubFrontmatter
}
// 배지 색상 타입
export type BadgeColor = 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'

// 카테고리 색상 매핑
export const categoryColors: Record<string, BadgeColor> = {
  finance: 'error',
  support: 'info',
  pension: 'success',
  insurance: 'secondary',
  tips: 'warning'
}

// 카테고리 색상 가져오기 함수
export const getCategoryColor = (category: string): BadgeColor => {
  return categoryColors[category] ?? 'neutral'
}
