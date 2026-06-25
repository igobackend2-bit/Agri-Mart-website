import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Search
} from 'lucide-react';
import { BlogPost } from '../types';
import { SEED_POSTS } from '../seedData';
import { getBlogPosts } from '../siteConfig';

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
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  // Admin-authored posts (newest first) merged with the built-in seed posts.
  const ALL_POSTS = useMemo(() => [...getBlogPosts(), ...SEED_POSTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), []);
  const categories = useMemo(() => ['All', ...Array.from(new Set(ALL_POSTS.map((p) => p.category)))], [ALL_POSTS]);
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_POSTS.filter((p) => {
      const matchCat = activeCat === 'All' || p.category === activeCat;
      const matchText = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [query, activeCat, ALL_POSTS]);
  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);
  const relatedPosts = selectedPost ? ALL_POSTS.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 3) : [];

  // Blog JSON-LD structured data for SEO (rich results / article discovery).
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'igo-blog-schema';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'IGO Agri Mart — Agrarian Advisories & Organic Farming Blog',
      blogPost: ALL_POSTS.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.createdAt,
        articleSection: p.category,
        author: { '@type': 'Person', name: p.author },
      })),
    });
    document.getElementById('igo-blog-schema')?.remove();
    document.head.appendChild(script);
    return () => { document.getElementById('igo-blog-schema')?.remove(); };
  }, [ALL_POSTS]);

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

          {/* More advisories — related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display font-black text-slate-900 text-lg mb-4">More {selectedPost.category} advisories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <div key={rp.id} onClick={() => { setSelectedPost(rp); window.scrollTo({ top: 0, behavior: 'auto' }); }}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-100 hover:border-[#1B6B3A]/30 hover:shadow-md transition overflow-hidden">
                    <div className="h-32 bg-slate-100 overflow-hidden">
                      <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#1B6B3A]">{rp.category}</span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug mt-1 line-clamp-2 group-hover:text-[#1B6B3A] transition">{rp.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

        {/* Professional hero */}
        <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-[#0a2e18] via-[#134e2a] to-[#0a2e18] shadow-xl px-6 sm:px-12 py-12 sm:py-14">
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-[#E8A020]/10 rounded-full blur-3xl pointer-events-none"></div>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-[#E8A020] text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Farmers’ Knowledge Hub · 27 Brands
          </span>
          <h1 className="font-display font-black text-white text-3xl sm:text-5xl tracking-tight mt-4">
            {lang === 'ta' ? 'அக்ரிடெக் செய்திப் பக்கங்கள்' : 'Agrarian Advisories & Farming Blog'}
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Sustainable farming tutorials, crop-health diagnostics, soil-nutrient correction guides and agribusiness updates — curated by IGO’s Chennai agronomists.
          </p>
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search advisories, crops, tags…"
              className="w-full bg-white rounded-full pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-700 shadow-lg outline-none focus:ring-2 focus:ring-[#E8A020]" />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCat(c)}
              className={'text-xs font-black px-4 py-2 rounded-full border transition ' + (activeCat === c ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B6B3A]/40')}>
              {c}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm font-bold text-slate-500">No articles match your search. Try another keyword or category.</p>
          </div>
        )}

        {/* Featured (latest) post */}
        {featured && (
          <div onClick={() => setSelectedPost(featured)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-100 hover:border-[#1B6B3A]/30 hover:shadow-lg transition overflow-hidden mb-8 grid md:grid-cols-2">
            <div className="relative h-56 md:h-auto bg-slate-100 overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <span className="absolute top-3 left-3 bg-[#E8A020] text-emerald-950 text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider">Featured · {featured.category}</span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex gap-4 text-[10px] text-slate-400 font-mono uppercase mb-2">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(featured.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
              </div>
              <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl leading-tight group-hover:text-[#1B6B3A] transition">{featured.title}</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-[#1B6B3A] text-sm font-black">Read Article <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
        )}

        {/* Blog Post List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
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
