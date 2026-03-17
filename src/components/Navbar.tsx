'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setIsLoggedIn(pb.authStore.isValid);
    setUserName(pb.authStore.record?.name || pb.authStore.record?.email || '');

    const unsubscribe = pb.authStore.onChange(() => {
      setIsLoggedIn(pb.authStore.isValid);
      setUserName(pb.authStore.record?.name || pb.authStore.record?.email || '');
    });

    return () => { unsubscribe(); };
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          게시판
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-600">{userName}</span>
              <Link
                href="/posts/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                글쓰기
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                로그인
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
