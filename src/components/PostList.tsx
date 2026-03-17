'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import pb from '@/lib/pocketbase';
import { Post } from '@/lib/types';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (p: number) => {
    setLoading(true);
    try {
      const result = await pb.collection('posts').getList<Post>(p, 10, {
        sort: '-created',
        expand: 'author',
      });
      setPosts(result.items);
      setTotalPages(result.totalPages);
      setPage(result.page);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        아직 게시글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span>{post.expand?.author?.name || '익명'}</span>
                  <span>{new Date(post.created).toLocaleDateString('ko-KR')}</span>
                  <span>조회 {post.views || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => fetchPosts(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => fetchPosts(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
