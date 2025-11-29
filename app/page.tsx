"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

// データの型定義
type Post = {
  id: number;
  content: string;
  created_at: string;
  user_id: string; // 誰の投稿か識別するために追加
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null); // ログインユーザー情報
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // ログインか登録かの切り替え

  // 初回読み込み時にユーザー確認とデータ取得
  useEffect(() => {
    checkUser();
    
    // ログイン状態が変わったら自動で検知するリスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPosts();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) fetchPosts();
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  // サインアップ（新規登録）処理
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert('登録エラー: ' + error.message);
    } else {
      alert('登録が完了しました！自動でログインします。');
    }
    setLoading(false);
  };

  // サインイン（ログイン）処理
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert('ログインエラー: ' + error.message);
    }
    setLoading(false);
  };

  // ログアウト処理
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPosts([]);
  };

  // 日記投稿処理
  const addPost = async () => {
    if (!content || !user) return;
    const { error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user.id }]);

    if (error) {
      console.error(error);
      alert('エラーが発生しました: ' + error.message);
    } else {
      setContent('');
      fetchPosts();
    }
  };

  // ── ログインしていない時の画面 ──
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Markdown Diaryを使ってみよう
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード（6文字以上）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '処理中...' : (isSignUp ? '登録する' : 'ログイン')}
              </button>
            </div>
          </form>
          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? 'すでにアカウントをお持ちですか？ログイン' : 'アカウントを作成する'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── ログインしている時の画面（いつもの日記アプリ） ──
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 Markdown Diary</h1>
          <button 
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-red-500 underline"
          >
            ログアウト
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">ログイン中: {user.email}</p>
        
        {/* 入力エリア */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="今日は何を学びましたか？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            onClick={addPost}
            className="mt-3 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            日記を保存する
          </button>
        </div>

        {/* 日記一覧エリア */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-xs text-gray-400 mb-2 border-b pb-2">
                {new Date(post.created_at).toLocaleString('ja-JP')}
              </p>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}