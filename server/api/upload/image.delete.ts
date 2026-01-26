
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  // 인증 필요시 체크
  // await requireAdmin(event)

  const { publicId } = await readBody<{ publicId: string }>(event)
  if (!publicId) {
    throw createError({ statusCode: 400, statusMessage: 'publicId가 필요합니다.' })
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    return { ok: res.result === 'ok', result: res.result }
  } catch (e: any) {
    console.error('Cloudinary destroy error:', e)
    throw createError({ statusCode: 500, statusMessage: '이미지 삭제 실패' })
  }
})
