import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 카테고리 생성
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'finance' },
      update: {},
      create: {
        slug: 'finance',
        name: '금융위기탈출',
        description: '압류방지통장, 채무조정 등 금융 어려움 해결 정보',
        icon: 'i-heroicons-banknotes',
        sortOrder: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'support' },
      update: {},
      create: {
        slug: 'support',
        name: '정부지원금',
        description: '긴급복지, 근로장려금 등 정부 지원 제도 안내',
        icon: 'i-heroicons-hand-raised',
        sortOrder: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'pension' },
      update: {},
      create: {
        slug: 'pension',
        name: '연금가이드',
        description: '국민연금, 퇴직연금, 개인연금 정보',
        icon: 'i-heroicons-calculator',
        sortOrder: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'insurance' },
      update: {},
      create: {
        slug: 'insurance',
        name: '보험정보',
        description: '실손보험, 자동차보험 등 보험 관련 정보',
        icon: 'i-heroicons-shield-check',
        sortOrder: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'tips' },
      update: {},
      create: {
        slug: 'tips',
        name: '생활꿀팁',
        description: '통신비 절약, 세금 환급 등 생활 정보',
        icon: 'i-heroicons-light-bulb',
        sortOrder: 5
      }
    })
  ])

  console.log('카테고리 생성 완료:', categories.length)

  // 카테고리 찾기
  const finance = categories.find(c => c.slug === 'finance')!
  const support = categories.find(c => c.slug === 'support')!
  const pension = categories.find(c => c.slug === 'pension')!
  const insurance = categories.find(c => c.slug === 'insurance')!
  const tips = categories.find(c => c.slug === 'tips')!

  // 샘플 게시글 생성
  const postsData = [
    // 금융위기탈출
    {
      slug: 'anti-seizure-account-2026',
      title: '압류방지통장 만드는 법 (2026년 최신)',
      description: '행복지킴이통장, 희망지킴이통장 신청 자격과 방법을 상세히 알려드립니다.',
      content: `## 압류방지통장이란?\n\n압류방지통장은 채권자의 압류로부터 보호받을 수 있는 특별한 통장입니다.\n\n## 신청 자격\n\n- 기초생활수급자\n- 차상위계층\n- 긴급복지지원 대상자\n\n## 신청 방법\n\n1. 주민센터 방문\n2. 필요 서류 제출\n3. 심사 후 발급`,
      categoryId: finance.id,
      tags: ['압류방지', '행복지킴이', '채무'],
      published: true,
      viewCount: 15234
    },
    {
      slug: 'new-start-fund-eligibility',
      title: '새도약기금 신청자격 총정리',
      description: '2026년 새도약기금 신청 조건, 필요 서류, 신청 방법을 알아봅니다.',
      content: `## 새도약기금이란?\n\n새도약기금은 채무 조정을 통해 경제적 재기를 돕는 제도입니다.\n\n## 신청 자격\n\n- 연체 기간 6개월 이상\n- 총 채무 10억원 이하`,
      categoryId: finance.id,
      tags: ['새도약기금', '채무조정'],
      published: true,
      viewCount: 12890
    },
    {
      slug: 'personal-rehabilitation-guide',
      title: '개인회생 신청 절차와 비용',
      description: '개인회생 신청 자격, 절차, 비용, 기간을 상세히 안내합니다.',
      content: `## 개인회생이란?\n\n개인회생은 법원을 통해 채무를 조정받는 제도입니다.`,
      categoryId: finance.id,
      tags: ['개인회생', '채무조정'],
      published: true,
      viewCount: 9870
    },
    {
      slug: 'credit-recovery-committee',
      title: '신용회복위원회 채무조정 신청 방법',
      description: '신용회복위원회를 통한 채무조정 제도와 신청 방법을 알아봅니다.',
      content: `## 신용회복위원회란?\n\n신용회복위원회는 채무자의 신용 회복을 돕는 기관입니다.`,
      categoryId: finance.id,
      tags: ['신용회복', '채무조정'],
      published: true,
      viewCount: 8540
    },
    // 정부지원금
    {
      slug: 'earned-income-tax-credit-2025',
      title: '근로장려금 신청 방법 (2025)',
      description: '근로장려금 자격 조건과 신청 방법, 지급일정을 알아봅니다.',
      content: `## 근로장려금이란?\n\n근로장려금은 저소득 근로자를 지원하는 제도입니다.`,
      categoryId: support.id,
      tags: ['근로장려금', '정부지원'],
      published: true,
      viewCount: 3421
    },
    {
      slug: 'housing-benefit-guide',
      title: '주거급여 신청 자격 및 방법',
      description: '주거급여 대상자 조건과 신청 절차를 안내합니다.',
      content: `## 주거급여란?\n\n주거급여는 저소득층의 주거비를 지원하는 제도입니다.`,
      categoryId: support.id,
      tags: ['주거급여', '정부지원'],
      published: true,
      viewCount: 1987
    },
    // 연금가이드
    {
      slug: 'national-pension-calculation',
      title: '국민연금 예상수령액 조회 방법',
      description: '내 국민연금 얼마나 받을 수 있을까? 조회 방법과 수령액 늘리는 팁.',
      content: `## 국민연금 조회 방법\n\n국민연금공단 홈페이지에서 조회할 수 있습니다.`,
      categoryId: pension.id,
      tags: ['국민연금', '연금조회'],
      published: true,
      viewCount: 11456
    },
    {
      slug: 'retirement-pension-comparison',
      title: '퇴직연금 DB vs DC 뭐가 좋을까?',
      description: 'DB형과 DC형 퇴직연금의 차이점과 선택 기준을 비교합니다.',
      content: `## DB형 vs DC형\n\nDB형은 확정급여형, DC형은 확정기여형입니다.`,
      categoryId: pension.id,
      tags: ['퇴직연금', 'DB', 'DC'],
      published: true,
      viewCount: 2890
    },
    // 보험정보
    {
      slug: 'health-insurance-claim',
      title: '실손보험 청구 방법 (간편 청구)',
      description: '실손의료보험 청구 서류와 간편 청구 앱 사용법을 알아봅니다.',
      content: `## 실손보험 청구\n\n실손보험은 의료비를 보장받는 보험입니다.`,
      categoryId: insurance.id,
      tags: ['실손보험', '보험청구'],
      published: true,
      viewCount: 2456
    },
    {
      slug: 'car-insurance-comparison',
      title: '자동차보험 갱신 할인 받는 법',
      description: '자동차보험 갱신 시 할인 받는 방법과 비교 사이트 활용법.',
      content: `## 자동차보험 할인\n\n다이렉트 보험으로 가입하면 할인됩니다.`,
      categoryId: insurance.id,
      tags: ['자동차보험', '보험할인'],
      published: true,
      viewCount: 1756
    },
    // 생활꿀팁
    {
      slug: 'phone-bill-save-tips',
      title: '통신비 월 3만원 아끼는 방법',
      description: '알뜰폰, 결합할인 등 통신비 절약 꿀팁을 정리했습니다.',
      content: `## 통신비 절약\n\n알뜰폰으로 바꾸면 월 3만원 이상 절약됩니다.`,
      categoryId: tips.id,
      tags: ['통신비', '절약'],
      published: true,
      viewCount: 2234
    }
  ]

  for (const postData of postsData) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData
    })
  }

  console.log('샘플 게시글 생성 완료:', postsData.length)

  // 관리자 등록
  const admin = await prisma.adminUser.upsert({
    where: { email: 'ljt721@naver.com' },
    update: {},
    create: {
      email: 'ljt721@naver.com'
    }
  })

  console.log('관리자 등록 완료:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })