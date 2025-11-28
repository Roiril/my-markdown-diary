"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // さっき作ったファイルを読み込む
import ReactMarkdown from 'react-markdown';

// データの型定義（TypeScript用）
type Post = {
  id: number;
  content: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');

  // 画面が開かれたときに、日記データを取得する
  useEffect(() => {
    fetchPosts();
  }, []);

  // Supabaseから日記データを取ってくる関数
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.log('error', error);
    if (data) setPosts(data);
  };

  // 日記を保存する関数
  const addPost = async () => {
    if (!content) return;
    
    // Supabaseにデータを送る
    const { error } = await supabase
      .from('posts')
      .insert([{ content }]);

    if (error) {
      alert('エラーが発生しました！Consoleを確認してください');
      console.log(error);
    } else {
      setContent(''); // 入力欄を空にする
      fetchPosts();   // リストを更新して新しい投稿を表示
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📝 Markdown Diary</h1>
        
        {/* 入力エリア */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="今日は何を学びましたか？ markdownが使えます（# タイトル, **太字** など）"
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
              {/* ここでMarkdownとして表示 */}
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500">まだ日記はありません。最初の投稿を書いてみましょう！</p>
          )}
        </div>
      </div>
    </main>
  );
}