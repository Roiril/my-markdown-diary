"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen text-gray-100 font-sans overflow-hidden">

      {/* ▼▼▼ 背景画像の層（修正部分） ▼▼▼ */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/Roil_hci_icon.png')", 
          // 'cover' から 'contain' に変更：画像全体が見えるように縮小・拡大する
          backgroundSize: 'contain',   
          // 画像を繰り返さない
          backgroundRepeat: 'no-repeat',
          // 真ん中に置く
          backgroundPosition: 'center', 
          // 余ったスペースは黒くする
          backgroundColor: '#000',
          // ぼかしと明るさ調整（ここはお好みで調整してください）
          filter: 'blur(4px) brightness(0.7)', 
        }}
      ></div>
      {/* ▲▲▲ ここまで ▲▲▲ */}


      {/* ▼▼▼ オーバーレイ層（変更なし） ▼▼▼ */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      {/* ▲▲▲ ここまで ▲▲▲ */}


      {/* ▼▼▼ コンテンツ層（変更なし） ▼▼▼ */}
      <div className="relative z-20">

        {/* ヒーローセクション */}
        <section className="flex flex-col items-center justify-center h-screen px-4">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-lg">
               <span className="text-blue-400">Shiroishi</span> Lab
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
              明治大学/先端メディアサイエンス学科
              <br />
              面白いと思ったものを作る。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="#works" className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg">
                View Works
              </a>
              <a href="#contact" className="px-6 py-3 rounded-full border border-gray-400 text-gray-200 hover:bg-white/10 transition shadow-lg">
                Contact Me
              </a>
            </div>
          </div>
        </section>

        {/* Aboutセクション */}
        <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-md">About Me</h2>
          <div className="bg-black/50 p-8 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
            <p className="leading-relaxed text-gray-300 mb-4">
              はじめまして。明治大学の先端メディアサイエンス学科に所属しています。
              大学ではヒューマンコンピューターインタラクション(HCI)の研究をしつつ、個人開発でUnityやWebアプリケーションを作っています。
            </p>
            <p className="leading-relaxed text-gray-300">
              このサイトはNext.jsとSupabaseで作ってVercelで公開しています。 <br />
              「面白いと思ったもの」をこれからはいっぱい作っていこうと思います。
            </p>
            
            <div className="mt-6">
              <h3 className="font-bold text-white mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Unity', 'TypeScript', 'Next.js', 'React', 'Supabase','C#' ,'Python', 'Git'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm border border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Worksセクション */}
        <section id="works" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-white drop-shadow-md">Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* 作品1: Markdown Diary */}
              <div className="bg-black/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 backdrop-blur-sm hover:border-blue-500 transition">
                <div className="h-48 bg-blue-900/30 flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Markdown Diary</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Next.jsとSupabaseで構築した、マークダウン記法対応の日記アプリ。
                    認証機能、CRUD処理、RLSによるセキュリティ設定を実装しました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800">Next.js</span>
                    <span className="text-xs px-2 py-1 bg-green-900/50 text-green-300 rounded border border-green-800">Supabase</span>
                  </div>
                  <div className="flex gap-4">
                    <a href="https://my-markdown-diary.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                      Live Demo →
                    </a>
                    <a href="https://github.com/YourName/my-markdown-diary" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline text-sm">
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>

              {/* 作品2: My Portfolio */}
              <div className="bg-black/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 backdrop-blur-sm hover:border-purple-500 transition">
                <div className="h-48 bg-purple-900/30 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">My Portfolio</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    自分自身の経歴と作品を紹介するポートフォリオサイト。
                    シンプルで見やすいデザインを心がけました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800">Next.js</span>
                    <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded border border-purple-800">Tailwind CSS</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contactセクション */}
        <section id="contact" className="py-20 px-6 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-md">Contact</h2>
          <p className="text-gray-300 mb-8">
            HCI関連の研究や開発について、お気軽にご連絡ください。
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://www.youtube.com/@Roil_HCI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition">
              <span className="text-xl">📺</span> YouTube
            </a>
            <a href="https://x.com/Roil_HCI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition">
              <span className="text-xl">✖</span> X (Twitter)
            </a>
          </div>
        </section>

        {/* フッター */}
        <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800">
          © {new Date().getFullYear()} Shiroishi Lab / Roil. All rights reserved.
        </footer>

      </div>
    </main>
  );
}