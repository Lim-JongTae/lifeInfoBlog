<template>
  <div class="tiptap-editor">
    <!-- 툴바 -->
    <div class="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <UButton
        size="xs"
        :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-bold"
        title="굵게"
        @click="editor?.chain().focus().toggleBold().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-italic"
        title="기울임"
        @click="editor?.chain().focus().toggleItalic().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('underline') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-underline"
        title="밑줄"
        @click="editor?.chain().focus().toggleUnderline().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('strike') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-strikethrough"
        title="취소선"
        @click="editor?.chain().focus().toggleStrike().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'neutral'"
        variant="ghost"
        title="제목 1"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </UButton>
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'neutral'"
        variant="ghost"
        title="제목 2"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </UButton>
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 3 }) ? 'primary' : 'neutral'"
        variant="ghost"
        title="제목 3"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </UButton>

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <UButton
        size="xs"
        :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-list-bullet"
        title="글머리 기호"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-numbered-list"
        title="번호 매기기"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <UButton
        size="xs"
        :color="editor?.isActive('blockquote') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        title="인용구"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('codeBlock') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-code-bracket"
        title="코드 블록"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 링크 -->
      <UButton
        size="xs"
        :color="editor?.isActive('link') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-link"
        title="링크"
        @click="setLink"
      />

      <!-- 이미지 업로드 -->
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-photo"
        title="이미지 업로드"
        :loading="uploading"
        @click="triggerImageUpload"
      />
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 실행 취소/다시 실행 -->
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-uturn-left"
        title="실행 취소"
        :disabled="!editor?.can().undo()"
        @click="editor?.chain().focus().undo().run()"
      />
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-uturn-right"
        title="다시 실행"
        :disabled="!editor?.can().redo()"
        @click="editor?.chain().focus().redo().run()"
      />
    </div>

    <!-- 에디터 본문 -->
    <EditorContent
      :editor="editor"
      class="prose prose-lg dark:prose-invert max-w-none p-4 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg focus-within:ring-2 focus-within:ring-primary"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
let isUpdatingFromEditor = false

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline'
      }
    }),
    Underline,
    Placeholder.configure({
      placeholder: '본문을 입력하세요...'
    })
  ],
  onUpdate: ({ editor }) => {
    isUpdatingFromEditor = true
    const html = editor.getHTML()
    emit('update:modelValue', html)
    nextTick(() => {
      isUpdatingFromEditor = false
    })
  }
})

watch(() => props.modelValue, (newValue) => {
  if (isUpdatingFromEditor || !editor.value || !newValue) return

  if (newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

// 링크 추가
const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL을 입력하세요:', previousUrl)
  
  if (url === null) return
  
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// 이미지 업로드 트리거
const triggerImageUpload = () => {
  imageInput.value?.click()
}

// 이미지 업로드 처리
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const result = await $fetch<{ url: string }>('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    // 에디터에 이미지 삽입
    editor.value?.chain().focus().setImage({ src: result.url }).run()
  } catch (e) {
    console.error('Image upload error:', e)
    alert('이미지 업로드에 실패했습니다.')
  } finally {
    uploading.value = false
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor :deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
}

.tiptap-editor :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
}
</style>