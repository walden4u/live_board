'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { Post } from '@/lib/types';

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!post;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pb.authStore.isValid) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await pb.collection('posts').update(post!.id, { title, content });
      } else {
        await pb.collection('posts').create({
          title,
          content,
          author: pb.authStore.record!.id,
          views: 0,
        });
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
          maxLength={200}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          required
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '저장 중...' : isEdit ? '수정' : '등록'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
