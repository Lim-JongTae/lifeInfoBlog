import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Cloudinary 설정
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  // 파일 읽기
  const formData = await readMultipartFormData(event)
  
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: '파일이 없습니다.'
    })
  }

  const file = formData[0]
  
  if (!file.type?.startsWith('image/')) {
    throw createError({
      statusCode: 400,
      message: '이미지 파일만 업로드 가능합니다.'
    })
  }

  try {
    // Base64로 변환
    const base64 = `data:${file.type};base64,${file.data.toString('base64')}`

    // Cloudinary 업로드
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'blog-images',
      resource_type: 'image'
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }
  } catch (e: any) {
    console.error('Cloudinary upload error:', e)
    throw createError({
      statusCode: 500,
      message: '이미지 업로드에 실패했습니다.'
    })
  }
})
