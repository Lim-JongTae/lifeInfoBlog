import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    return false
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email }
  })

  return !!admin
})