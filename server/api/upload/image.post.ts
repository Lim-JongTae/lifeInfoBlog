
import { v2 as cloudinary } from 'cloudinary'
import { readMultipartFormData, getRequestIP } from 'h3'
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

// 간단 rate limiter (메모리; 프로덕션은 Redis 등 사용 권장)
const bucket = new Map<string, { count: number; ts: number }>()
function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const curr = bucket.get(ip) ?? { count: 0, ts: now }
  if (now - curr.ts > windowMs) {
    curr.count = 0
    curr.ts = now
  }
  curr.count++
  bucket.set(ip, curr)
  if (curr.count > limit) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // 인증이 필요하면 여기서 검사 (예: 세션/토큰/관리자 이메일 화이트리스트)
  // const session = await requireAdmin(event) // TODO

  // 간단 rate limit
  const ip = getRequestIP(event) || '0.0.0.0'
  rateLimit(ip)

  // Cloudinary 설정
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  // multipart 읽기
  const form = await readMultipartFormData(event)
  if (!form || form.length === 0) {
    throw createError({ statusCode: 400, statusMessage: '파일이 없습니다.' })
  }

  const file = form.find(f => f.name === 'file')
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'file 필드가 필요합니다.' })
  }

  // 검증: MIME / size
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
  const type = file.type || ''
  if (!allowed.has(type)) {
    throw createError({ statusCode: 400, statusMessage: '허용되지 않은 이미지 형식입니다.' })
  }
  // 최대 10MB 예시
  const MAX_BYTES = 10 * 1024 * 1024
  if (!file.data || file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 400, statusMessage: '파일 용량이 제한을 초과했습니다(최대 10MB).' })
  }

  try {
    // 날짜 기반 폴더
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const folder = `blog-images/${yyyy}/${mm}`

    // Stream 업로드 (메모리 복사 최소화)
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          // 필요한 경우 eager 변환(썸네일 등)도 지정 가능
          // eager: [{ width: 800, crop: 'scale', fetch_format: 'auto', quality: 'auto' }]
        },
        (err, res) => (err ? reject(err) : resolve(res!))
      )
      upload.end(file.data) // Buffer를 Stream에 전달
    })

    // 최적화된 전달 URL (f_auto,q_auto)
    // Cloudinary는 전달 시 transformation을 path로 지정해야 함
    // secure_url을 기반으로 변환 URL을 만들거나, result.public_id로 직접 생성 가능
    const deliveryBase = `https://res.cloudinary.com/${config.cloudinaryCloudName}/image/upload`
    const optimizedUrl = `https://res.cloudinary.com/${config.cloudinaryCloudName}/image/upload/f_auto,q_auto/${result.public_id}.${result.format}`

    return {
      url: optimizedUrl,                 // 최적화 전달 URL
      originalUrl: result.secure_url,    // 원본
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (e: any) {
    console.error('Cloudinary upload error:', {
      message: e.message,
      http_code: e.http_code,
      name: e.name
    })
    throw createError({
      statusCode: 500,
      statusMessage: '이미지 업로드에 실패했습니다.'
    })
  }
})
