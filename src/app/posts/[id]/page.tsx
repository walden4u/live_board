'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import pb from '@/lib/pocketbase';
import { Post } from '@/lib/types';
import CommentSection from '@/components/CommentSection';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const postId = params.id as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const record = await pb.collection('posts').getOne<Post>(postId, {
          expand: 'author',
        });
        setPost(record);

        // 조회수 증가
        await pb.collection('posts').update(postId, {
          views: (record.views || 0) + 1,
        });
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await pb.collection('posts').delete(postId);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  }

  if (!post) {
    return <div className="text-center py-10 text-gray-500">게시글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = pb.authStore.record?.id === post.author;

  return (
    <div>
      <article className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b">
          <span>{post.expand?.author?.name || '익명'}</span>
          <span>{new Date(post.created).toLocaleString('ko-KR')}</span>
          <span>조회 {post.views || 0}</span>
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {isAuthor && (
        <div className="flex gap-2 mt-4">
          <Link
            href={`/posts/${postId}/edit`}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      )}

      <CommentSection postId={postId} />

      <div className="mt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 목록으로
        </Link>
      </div>
    </div>
  );
}
