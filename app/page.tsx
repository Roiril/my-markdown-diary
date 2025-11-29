"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

// データの型定義
type Post = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // 編集機能用の状態（State）
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 初回読み込みとログイン監視
  useEffect(() => {
    checkUser();
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

  // 認証関連（サインアップ・サインイン・ログアウト）
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('登録エラー: ' + error.message);
    else alert('登録完了！自動でログインします。');
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('ログインエラー: ' + error.message);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPosts([]);
  };

  // 📝 投稿処理
  const addPost = async () => {
    if (!content || !user) return;
    const { error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user.id }]);

    if (error) {
      alert('エラーが発生しました: ' + error.message);
    } else {
      setContent('');
      fetchPosts();
    }
  };

  // 🗑️ 削除処理
  const deletePost = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) alert('削除エラー: ' + error.message);
    else fetchPosts();
  };

  // ✏️ 編集モード開始
  const startEditing = (post: Post) => {
    setEditingPost(post);
    setEditingContent(post.content);
  };

  // ✏️ 編集保存処理
  const updatePost = async () => {
    if (!editingPost) return;

    const { error } = await supabase
      .from('posts')
      .update({ content: editingContent })
      .eq('id', editingPost.id);

    if (error) {
      alert('更新エラー: ' + error.message);
    } else {
      setEditingPost(null); // 編集モード終了
      setEditingContent('');
      fetchPosts();
    }
  };

  // ── ログイン画面 ──
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">Markdown Diaryへようこそ</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="パスワード（6文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {loading ? '処理中...' : (isSignUp ? '登録する' : 'ログイン')}
            </button>
          </form>
          <div className="text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-blue-600 hover:text-blue-500">
              {isSignUp ? 'ログインへ戻る' : 'アカウントを作成する'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 日記アプリ画面 ──
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 Markdown Diary</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700 underline">
              ログアウト
            </button>
          </div>
        </div>
        
        {/* 新規投稿エリア */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="今日は何を学びましたか？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={addPost} className="mt-3 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            日記を保存する
          </button>
        </div>

        {/* 投稿一覧エリア */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative group">
              
              {/* 編集モードかどうかで表示を切り替え */}
              {editingPost?.id === post.id ? (
                // 編集モードの表示
                <div className="space-y-3">
                  <textarea
                    className="w-full h-32 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-blue-50"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingPost(null)} 
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={updatePost} 
                      className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      更新を保存
                    </button>
                  </div>
                </div>
              ) : (
                // 通常モードの表示
                <>
                  <div className="flex justify-between items-start mb-2 border-b pb-2">
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleString('ja-JP')}
                    </p>
                    
                    {/* 操作ボタン（自分の投稿の場合のみ表示） */}
                    {user.id === post.user_id && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditing(post)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                          title="編集"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="削除"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}