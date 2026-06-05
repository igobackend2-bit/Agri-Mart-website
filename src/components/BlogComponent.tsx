import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Tag, 
  BookOpen, 
  Share2, 
  ChevronRight,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../types';
import { SEED_POSTS } from '../seedData';

interface BlogComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
}

export default function BlogComponent({
  lang,
  setCurrentPage
}: BlogComponentProps) {
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isAlreadyLiked = likedMap[id];
    setLikedMap({ ...likedMap, [id]: !isAlreadyLiked });
    
    const currentLikes = likesCount[id] || 0;
    setLikesCount({
      ...likesCount,
      [id]: isAlreadyLiked ? currentLikes - 1 : currentLikes + 1
    });
  };

  if (selectedPost) {
    // IMMERSIVE READING PANELS MODE
    return (
      <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Trigger */}
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-[#1B6B3A] text-xs font-bold mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Agri Advisory Blog</span>
          </button>

          {/* Reading Page layout */}
          <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            
            {/* Header Image */}
            <div className="h-80 relative bg-slate-150">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#E8A020] text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1.5 rounded tracking-wider">
                  {selectedPost.category}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3.5xl mt-3 leading-tight tracking-tight">
                  {selectedPost.title}
                </h1>
              </div>
            </div>

            {/* Meta row info */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#1B6B3A]" />
                  <span>By {selectedPost.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#1B6B3A]" />
                  <span>{new Date(selectedPost.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1B6B3A]" />
                  <span>{selectedPost.readTime}</span>
                </span>
              </div>

              {/* Likes trigger */}
              <button 
                onClick={(e) => handleLike(selectedPost.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${likedMap[selectedPost.id] ? 'bg-red-50 text-red-650 font-bold border border-red-200' : 'bg-slate-105 text-slate-600 hover:bg-slate-200'}`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Like ({likesCount[selectedPost.id] || 0})</span>
              </button>
            </div>

            {/* Article Content paragraphs */}
            <div className="p-6 md:p-8 space-y-5">
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium bg-[#1B6B3A]/5 p-4 rounded-xl border-l-4 border-[#1B6B3A] md:-mx-4">
                "{selectedPost.excerpt}"
              </p>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="indent-4 leading-relaxed tracking-wide text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags block */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                  {selectedPost.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-100 text-[#1B6B3A] text-[10px] font-bold px-2.5 py-1 rounded-full font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Related advice note */}
          <div className="mt-8 bg-emerald-950 text-white rounded-xl p-5 border border-emerald-800 flex gap-4 text-xs">
            <BookOpen className="h-5 w-5 text-[#E8A020] shrink-0" />
            <div>
              <h4 className="font-bold text-[#E8A020] uppercase tracking-wide">
                IGO Agrar Science Division
              </h4>
              <p className="text-emerald-200 mt-0.5 leading-relaxed">
                Advisory reports are compiled by certified scientists from IGO Bio Solutions Chennai Headquarters. For custom farm evaluations, submit a soil or crop care request directly on our Expert Services Panel.
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb path */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">Agritech News & Crop Advisories</span>
        </nav>

        {/* Header Hero Title */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="bg-[#1B6B3A]/10 text-[#1B6B3A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Farmers’ Knowledge Hub • 27 Brands Integrated
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight">
              {lang === 'ta' ? 'அக்ரிடெக் செய்திப் பக்கங்கள்' : 'Agrarian Advisories & Organic Farming Blog'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              Sustainable agriculture tutorials, crop health diagnostic sheets, soil nutrient correction guides, and global agribusiness updates curated by Chennai agronomists.
            </p>
          </div>
        </div>

        {/* Blog Post List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_POSTS.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl border border-slate-100 hover:border-[#1B6B3A]/30 hover:shadow-md transition duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail cover */}
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {post.category}
                  </div>
                </div>

                <div className="p-5">
                  {/* Meta indices */}
                  <div className="flex gap-4 text-[10px] text-slate-400 font-mono uppercase mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-[#1B6B3A] transition">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Action row footer */}
              <div className="px-5 pb-5 pt-3.5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  By {post.author.split(' ')[0]}
                </span>
                
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-1 text-[#1B6B3A] group-hover:text-[#15532d] text-xs font-bold transition"
                >
                  <span>Read Post</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
