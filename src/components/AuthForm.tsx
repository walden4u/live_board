'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import pb from '@/lib/pocketbase';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(email, password);
      } else {
        if (password !== passwordConfirm) {
          setError('비밀번호가 일치하지 않습니다.');
          setLoading(false);
          return;
        }
        await pb.collection('users').create({
          email,
          password,
          passwordConfirm,
          name,
        });
        await pb.collection('users').authWithPassword(email, password);
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (isLogin) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isLogin ? '로그인' : '회원가입'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          minLength={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!isLogin && (
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            required
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        {isLogin ? (
          <>
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
