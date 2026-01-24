<template>
  <div class="tiptap-editor">
    <!-- 툴바 -->
    <div class="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <!-- 텍스트 스타일 -->
      <UButton
        size="xs"
        :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-bold"
        @click="editor?.chain().focus().toggleBold().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-italic"
        @click="editor?.chain().focus().toggleItalic().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('strike') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-strikethrough"
        @click="editor?.chain().focus().toggleStrike().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 헤딩 -->
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'neutral'"
        variant="ghost"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </UButton>
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'neutral'"
        variant="ghost"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </UButton>
      <UButton
        size="xs"
        :color="editor?.isActive('heading', { level: 3 }) ? 'primary' : 'neutral'"
        variant="ghost"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </UButton>

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 리스트 -->
      <UButton
        size="xs"
        :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-list-bullet"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-numbered-list"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 인용구, 코드 -->
      <UButton
        size="xs"
        :color="editor?.isActive('blockquote') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      />
      <UButton
        size="xs"
        :color="editor?.isActive('codeBlock') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-code-bracket"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
      />

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <!-- 링크 -->
      <UButton
        size="xs"
        :color="editor?.isActive('link') ? 'primary' : 'neutral'"
        variant="ghost"
        icon="i-heroicons-link"
        @click="setLink"
      />

      <!-- 이미지 -->
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-photo"
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
        :disabled="!editor?.can().undo()"
        @click="editor?.chain().focus().undo().run()"
      />
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-uturn-right"
        :disabled="!editor?.can().redo()"
        @click="editor?.chain().focus().redo().run()"
      />
    </div>

    <!-- 에디터 본문 -->
    <EditorContent 
      :editor="editor" 
      class="prose prose-lg dark:prose-invert max-w-none p-4 min-h-400 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg focus-within:ring-2 focus-within:ring-primary"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

// 에디터 초기화
const editor = useEditor({
  content: props.modelValue,
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
    Placeholder.configure({
      placeholder: '내용을 입력하세요...'
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// modelValue 변경 감지
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

// 링크 추가
const setLink = () => {
  const url = window.prompt('URL을 입력하세요:')
  
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  } else {
    editor.value?.chain().focus().unsetLink().run()
  }
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
    // input 초기화
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

// 에디터 정리
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap-editor .ProseMirror {
  outline: none;
  min-height: 200px;
  max-height: 540px;
  overflow-y: auto;
}

.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}
</style>