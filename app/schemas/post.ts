import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(200, '제목은 200자 이내로 입력해주세요.'),
  slug: z.string()
    .min(1, '슬러그를 입력해주세요.')
    .max(100, '슬러그는 100자 이내로 입력해주세요.')
    .regex(/^[a-z0-9가-힣-]+$/, '슬러그는 영문 소문자, 숫자, 한글, 하이픈만 사용 가능합니다.'),
  description: z.string().max(500, '설명은 500자 이내로 입력해주세요.').optional(),
  content: z.string().min(1, '본문을 입력해주세요.'),
  categoryId: z.string().min(1, '카테고리를 선택해주세요.'),
  tags: z.array(z.string()).optional()
})

export type PostFormData = z.infer<typeof postSchema>