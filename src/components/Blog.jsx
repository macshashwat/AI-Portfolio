import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bookmark, Check, ChevronDown, Eye, FileText, Heart, Image, LockKeyhole,
  LogOut, MessageCircle, Pencil, Plus, Search, Share2, Sparkles, Tag,
  Trash2, UserCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));

const mapPost = (post) => ({
  ...post,
  publishedAt: post.published_at || post.publishedAt,
  coverUrl: post.cover_url || post.coverUrl,
  readTime: post.read_time || post.readTime,
  views: post.views || 0,
  likes: post.likes || 0,
  category: post.categories?.name || post.category || 'Uncategorized',
  tags: post.post_tags?.map(({ tags: tag }) => tag.name) || post.tags || [],
  author: post.profiles?.display_name || post.author || 'Shashwat Mishra',
  comments: post.comments || []
});

const providerIcons = {
  facebook: <svg width="29" height="29" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.12 4H18V.15A37.2 37.2 0 0 0 14.8 0C11.63 0 9.46 1.93 9.46 5.48V8.7H6v4.3h3.46V24h4.25V13h3.52l.56-4.3h-4.08V5.9c0-1.24.34-1.9 1.41-1.9Z" /></svg>,
  twitter: <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>,
  google: <svg width="29" height="29" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z" /><path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.75Z" /><path fill="#FBBC05" d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.65H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.35l3.25-2.52Z" /><path fill="#EA4335" d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.4l3.25 2.52C7.3 7.86 9.46 6.14 12 6.14Z" /></svg>,
  github: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.15c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>,
};

function LoginModal({ onClose, onLogin, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: email.split('@')[0] } } });
    setLoading(false);
    if (result.error) setError(result.error.message);
    else if (mode === 'signup' && !result.data.session) setMessage('Account created. Check your email to confirm your account, then sign in.');
    else onLogin();
  };
  const signInWithProvider = async (provider) => {
    setError('');
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    setLoading(false);
    if (authError) setError(authError.message);
    else if (!data?.url) setError(`${provider} login is not configured in Supabase Auth.`);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900">
      <div className="mb-8 flex items-start justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">{mode === 'login' ? 'Welcome back' : 'Join the conversation'}</p><h2 className="text-3xl font-bold">{mode === 'login' ? 'Sign in' : 'Create your account'}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X /></button></div>
      <div className="mb-5 flex items-center justify-center gap-3">
        {['facebook', 'twitter', 'google', 'github'].map((provider) => <button key={provider} type="button" disabled={loading} onClick={() => signInWithProvider(provider)} aria-label={`Continue with ${provider === 'twitter' ? 'X' : provider}`} className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${provider === 'facebook' ? 'bg-[#1877f2] text-white' : provider === 'twitter' ? 'bg-black text-white' : provider === 'google' ? 'border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-200 text-black shadow-sm dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-black' : 'bg-[#24292f] text-white'}`}>{providerIcons[provider]}</button>)}
      </div>
      <div className="mb-5 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /> or use email <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /></div>
      <label className="mb-4 block text-sm font-medium">Email<input className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="mb-2 block text-sm font-medium">Password<input type="password" minLength={6} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <p className="mb-6 text-xs text-gray-500">{mode === 'login' ? 'Admins can publish posts. Reader accounts can comment, like, and save posts.' : 'Create a reader account to comment, like, and save posts.'}</p>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}{message && <p className="mb-4 text-sm text-green-600">{message}</p>}<Button disabled={loading} className="w-full bg-green-500 py-6 hover:bg-green-600"><LockKeyhole size={17} className="mr-2" /> {loading ? 'Please wait…' : mode === 'login' ? 'Sign in securely' : 'Sign up'}</Button>
      <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }} className="mt-5 w-full text-sm text-green-600 hover:underline">{mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button>
    </form>
  </div>;
}

function UserMenu({ user, profile, admin, onProfile, onSignOut }) {
  const [open, setOpen] = useState(false);
  return <div className="relative">
    <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-green-500 bg-green-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-green-400" aria-expanded={open}>
      {profile?.avatar_url?.startsWith('emoji:') ? <span>{profile.avatar_url.slice(6)}</span> : profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-5 w-5 rounded-full object-cover" /> : <UserCircle size={18} className="text-green-500" />}<span className="max-w-[150px] truncate">{profile?.username || 'Set username'}</span><ChevronDown size={15} />
    </button>
    {open && <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border bg-white p-2 shadow-xl dark:bg-gray-900">
      <p className="px-3 py-2 text-xs text-gray-500">{admin ? 'Administrator' : 'Signed-in reader'}</p>
      <button onClick={() => { onProfile(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-xl border border-green-500 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-500 hover:text-black"><UserCircle size={16} /> Edit profile</button>
      <button onClick={onSignOut} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-green-500 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-500 hover:text-black"><LogOut size={16} /> Sign out</button>
    </div>}
  </div>;
}

const defaultMemojis = ['😀', '🤓', '🧑‍💻', '👾', '🚀'];

function ProfileModal({ profile, onSave, onClose, onUpload }) {
  const [username, setUsername] = useState(profile?.username || '');
  const [avatar, setAvatar] = useState(profile?.avatar_url || '');
  const [error, setError] = useState('');
  const save = async () => {
    if (!/^[a-zA-Z0-9_ -]{3,30}$/.test(username.trim())) {
      setError('Username must be 3–30 characters and use letters, numbers, spaces, _ or -.');
      return;
    }
    try { await onSave({ username: username.trim(), avatar_url: avatar }); onClose(); }
    catch (saveError) { setError(saveError.message); }
  };
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; const url = await onUpload(file); if (url) setAvatar(url); };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900">
      <div className="mb-7 flex items-start justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">Your profile</p><h2 className="text-3xl font-bold">Make it yours</h2></div><button onClick={onClose} aria-label="Close"><X /></button></div>
      <label className="block text-sm font-medium">Username<input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={30} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></label>
      <p className="mb-4 mt-1 text-xs text-gray-500">This name appears in your account menu and comments.</p>
      <p className="mb-2 text-sm font-medium">Choose an avatar</p><div className="mb-5 flex gap-2">{defaultMemojis.map((emoji) => <button key={emoji} onClick={() => setAvatar(`emoji:${emoji}`)} className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl ${avatar === `emoji:${emoji}` ? 'border-green-500 bg-green-500/10' : ''}`}>{emoji}</button>)}<label className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-gray-500 hover:border-green-500"><Image size={18} /><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} className="hidden" /></label></div>
      {avatar && <div className="mb-5 flex items-center gap-3">{avatar.startsWith('emoji:') ? <span className="text-4xl">{avatar.slice(6)}</span> : <img src={avatar} alt="Avatar preview" className="h-12 w-12 rounded-full object-cover" />}<span className="text-xs text-gray-500">Avatar preview</span></div>}
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}<Button onClick={save} className="w-full bg-green-500 text-black hover:bg-green-400">Save profile</Button>
    </div>
  </div>;
}

function Editor({ post, onSave, onClose, onUploadImage }) {
  const [form, setForm] = useState(post || { title: '', excerpt: '', content: '', category: 'AI Engineering', tags: '', publishedAt: new Date().toISOString().slice(0, 10), featured: false, status: 'draft', coverUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) update('coverUrl', url);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };
  const publish = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) { setError('Title, excerpt, and story content are required.'); return; }
    if (form.excerpt.trim().length < 10 || form.excerpt.trim().length > 400) { setError('Excerpt must be between 10 and 400 characters.'); return; }
    setSaving(true); setError('');
    try { await onSave({ ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : form.tags, status: 'published', author: 'Shashwat Mishra', readTime: Math.max(1, Math.ceil((form.content || '').split(/\s+/).length / 200)) }); }
    catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-8 dark:bg-gray-900">
    <div className="mb-8 flex justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">Content studio</p><h2 className="text-3xl font-bold">{post ? 'Edit post' : 'Create a post'}</h2></div><button onClick={onClose} aria-label="Close"><X /></button></div>
    <div className="grid gap-5 md:grid-cols-2">
      {['title', 'excerpt', 'category', 'publishedAt'].map((key) => <label key={key} className={key === 'excerpt' ? 'md:col-span-2 text-sm font-medium' : 'text-sm font-medium'}>{key[0].toUpperCase() + key.slice(1)}<input minLength={key === 'excerpt' ? 10 : undefined} maxLength={key === 'excerpt' ? 400 : key === 'title' ? 180 : undefined} value={form[key]} onChange={(e) => update(key, e.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></label>)}
      <label className="md:col-span-2 text-sm font-medium">Tags <span className="font-normal text-gray-500">(comma separated)</span><input value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={(e) => update('tags', e.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></label>
      <div className="md:col-span-2"><label className="text-sm font-medium">Story image or GIF <span className="font-normal text-gray-500">(PNG, JPG, WEBP, GIF · max 8 MB)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectImage} disabled={uploading} className="mt-2 block w-full rounded-xl border bg-transparent px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-500/10 file:px-3 file:py-2 file:font-semibold file:text-green-600" /></label>{uploading && <p className="mt-2 text-xs text-gray-500">Uploading image…</p>}{form.coverUrl && <img src={form.coverUrl} alt="Story preview" className="mt-4 max-h-48 w-full rounded-xl object-cover" />}</div>
      <label className="md:col-span-2 text-sm font-medium">Story<textarea rows="10" value={form.content} onChange={(e) => update('content', e.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></label>
    </div>
    {error && <p className="mt-5 text-sm text-red-500">{error}</p>}<div className="mt-6 flex flex-wrap items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Feature this post</label><div className="flex gap-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={saving || uploading} onClick={publish} className="bg-green-500 hover:bg-green-600"><Check size={17} className="mr-2" /> {saving ? 'Publishing…' : 'Publish post'}</Button></div></div>
  </div></div>;
}

function PostDetail({ post, posts, user, onBack, onUpdate, onLike, onBookmark, onComment, onRequireSignup }) {
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const related = posts.filter((item) => item.id !== post.id && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag)))).slice(0, 2);
  const update = (changes) => onUpdate({ ...post, ...changes });
  const addComment = () => {
    if (!user) { onRequireSignup(); return; }
    if (!comment.trim()) return;
    onComment(post.id, comment.trim(), replyTo);
    setComment('');
    setReplyTo(null);
  };
  const share = async () => { if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href }); else await navigator.clipboard?.writeText(window.location.href); };
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-8">
    <button onClick={onBack} className="mb-10 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-500"><ArrowLeft size={17} /> Back to all posts</button>
    <div className="mb-10 max-w-3xl"><div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-green-500"><span>{post.category}</span><span className="text-gray-300">•</span><span>{formatDate(post.publishedAt)}</span><span className="text-gray-300">•</span><span>{post.readTime} min read</span></div><h1 className="text-4xl font-black tracking-tight md:text-6xl">{post.title}</h1><p className="mt-6 text-xl leading-relaxed text-gray-500">{post.excerpt}</p>{post.coverUrl && <img src={post.coverUrl} alt="" className="mt-8 max-h-[440px] w-full rounded-3xl object-cover shadow-lg" />}<div className="mt-8 flex items-center gap-3 text-sm"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-black">SM</div><span>By <strong>{post.author}</strong><br /><span className="text-gray-500">Fullstack & backend developer</span></span></div></div>
    <div className="mb-10 flex flex-wrap items-center gap-3 border-y py-4">{user && <><button onClick={() => onLike(post)} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-green-500 hover:text-green-500"><Heart size={17} /> {post.likes}</button><button onClick={() => onBookmark(post)} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-green-500 hover:text-green-500 ${post.bookmarked ? 'border-green-500 text-green-500' : ''}`}><Bookmark size={17} /> {post.bookmarked ? 'Saved' : 'Save'}</button></>}<button onClick={share} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-green-500 hover:text-green-500"><Share2 size={17} /> Share</button><span className="ml-auto flex items-center gap-2 text-sm text-gray-500"><Eye size={17} /> {post.views.toLocaleString()} reads</span></div>
    <article className="prose prose-lg max-w-3xl dark:prose-invert">{post.content.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>
    <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_280px]"><section><h2 className="mb-5 flex items-center gap-2 text-2xl font-bold"><MessageCircle size={21} className="text-green-500" /> Discussion <span className="text-gray-400">({post.comments?.length || 0})</span></h2><div className="mb-6 flex gap-3"><input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} placeholder={replyTo ? 'Write a reply…' : 'Join the conversation…'} className="min-w-0 flex-1 rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /><Button onClick={addComment} className="bg-green-500 hover:bg-green-600">Post</Button></div>{replyTo && <button onClick={() => setReplyTo(null)} className="mb-4 text-xs text-gray-500">Cancel reply</button>}<div className="space-y-5">{(post.comments || []).map((item) => <div key={item.id} className="rounded-2xl border p-5"><div className="mb-2 flex justify-between text-sm"><strong>{item.author}</strong><span className="text-gray-400">Just now</span></div><p className="text-gray-600 dark:text-gray-300">{item.body}</p><button onClick={() => setReplyTo(item.id)} className="mt-3 text-xs font-semibold text-green-500">Reply</button></div>)}</div></section><aside><p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Related posts</p><div className="space-y-4">{related.map((item) => <button key={item.id} onClick={() => onUpdate(item)} className="block text-left"><span className="text-sm font-bold hover:text-green-500">{item.title}</span><span className="mt-1 block text-xs text-gray-500">{item.readTime} min read</span></button>)}</div></aside></div>
  </motion.div>;
}

function Dashboard({ posts, onNew, onEdit, onDelete, onOpen }) {
  return <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">Workspace</p><h1 className="text-4xl font-black">Content dashboard</h1></div><Button onClick={onNew} className="w-full bg-green-500 text-black hover:bg-green-400 sm:w-auto"><Plus size={17} className="mr-2" /> New post</Button></div>
    <div className="mb-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-white p-5 dark:bg-gray-900"><p className="text-sm text-gray-500">Published posts</p><p className="mt-2 text-3xl font-black">{posts.filter((post) => post.status === 'published').length}</p></div><div className="rounded-2xl border bg-white p-5 dark:bg-gray-900"><p className="text-sm text-gray-500">Total reads</p><p className="mt-2 text-3xl font-black">{posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}</p></div><div className="rounded-2xl border bg-white p-5 dark:bg-gray-900"><p className="text-sm text-gray-500">Engagement</p><p className="mt-2 text-3xl font-black">{posts.reduce((sum, post) => sum + post.likes + (post.comments?.length || 0), 0)}</p></div></div>
    <div className="overflow-hidden rounded-2xl border bg-white dark:bg-gray-900"><div className="grid grid-cols-[minmax(0,1fr)_80px_80px] gap-2 border-b px-3 py-4 text-xs font-semibold uppercase tracking-widest text-gray-400 sm:grid-cols-[1fr_120px_96px] sm:gap-4 sm:px-5"><span>Post</span><span className="text-center">Status</span><span className="text-right">Actions</span></div>{posts.map((post) => <div key={post.id} className="grid grid-cols-[minmax(0,1fr)_80px_80px] items-center gap-2 border-b px-3 py-5 last:border-0 sm:grid-cols-[1fr_120px_96px] sm:gap-4 sm:px-5"><button onClick={() => onOpen(post)} className="min-w-0 text-left"><p className="truncate font-bold hover:text-green-500">{post.title}</p><p className="mt-1 text-xs text-gray-500">{formatDate(post.publishedAt)} · {post.views} reads</p></button><span className="justify-self-center rounded-full bg-green-500/10 px-2 py-1 text-center text-[11px] capitalize text-green-600 sm:px-3 sm:text-xs">{post.status === 'published' ? 'Published' : 'Draft'}</span><div className="flex gap-2"><button onClick={() => onEdit(post)} aria-label={`Edit ${post.title}`} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><Pencil size={17} /></button><button onClick={() => onDelete(post.id)} aria-label={`Delete ${post.title}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={17} /></button></div></div>)}</div>
  </main>;
}

export default function Blog({ onClose }) {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [postFilter, setPostFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [editor, setEditor] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return undefined; }
    let active = true;
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (active && sessionData.session) setUser(sessionData.session.user);
      const { data, error } = await supabase.from('posts').select('*, categories(name), post_tags(tags(name)), profiles!posts_author_id_fkey(display_name), comments(id, body, created_at, profiles(display_name))').order('published_at', { ascending: false });
      if (error) setLoadError(error.message);
      else if (active) setPosts(data.map(mapPost));
      if (active) setLoading(false);
    };
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!supabase || !user) { setAdmin(false); return; }
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => { setProfile(data); setAdmin(data?.role === 'admin'); });
  }, [user]);
  useEffect(() => {
    if (!supabase || !user || posts.length === 0) {
      if (!user) setPosts((current) => current.map((post) => ({ ...post, liked: false, bookmarked: false })));
      return;
    }
    Promise.all([
      supabase.from('post_likes').select('post_id').eq('user_id', user.id),
      supabase.from('bookmarks').select('post_id').eq('user_id', user.id)
    ]).then(([likesResult, bookmarksResult]) => {
      if (likesResult.error) throw likesResult.error;
      if (bookmarksResult.error) throw bookmarksResult.error;
      const liked = new Set(likesResult.data.map(({ post_id }) => post_id));
      const bookmarked = new Set(bookmarksResult.data.map(({ post_id }) => post_id));
      setPosts((current) => current.map((post) => ({ ...post, liked: liked.has(post.id), bookmarked: bookmarked.has(post.id) })));
    }).catch((error) => setLoadError(error.message));
  }, [user, posts.length]);
  const categories = ['All', ...new Set(posts.map((post) => post.category))];
  const filtered = useMemo(() => posts.filter((post) => post.status === 'published' && (postFilter === 'all' || (postFilter === 'liked' && post.liked) || (postFilter === 'saved' && post.bookmarked)) && (category === 'All' || post.category === category) && `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [posts, postFilter, category, query]);
  const featured = filtered.find((post) => post.featured) || filtered[0];
  const updatePost = (next) => setPosts((current) => current.map((item) => item.id === next.id ? next : item));
  const openPost = async (post) => { const next = { ...post, views: post.views + 1 }; updatePost(next); setSelected(next); await supabase?.rpc('increment_post_views', { post_id: post.id }); };
  const savePost = async (post) => {
    const { data: categoryData, error: categoryError } = await supabase.from('categories').select('id').eq('name', post.category).single();
    if (categoryError) throw categoryError;
    const payload = { title: post.title, excerpt: post.excerpt, content: post.content, cover_url: post.coverUrl || null, category_id: categoryData.id, published_at: post.publishedAt, status: 'published', featured: post.featured, read_time: post.readTime, author_id: user.id, slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
    const { data, error } = post.id ? await supabase.from('posts').update(payload).eq('id', post.id).select('*, categories(name), profiles!posts_author_id_fkey(display_name)').single() : await supabase.from('posts').insert(payload).select('*, categories(name), profiles!posts_author_id_fkey(display_name)').single();
    if (error) throw new Error(error.message.includes("cover_url") ? 'The database is missing the cover_url column. Run supabase/migrations/006_fix_blog_schema.sql in Supabase SQL Editor, then try again.' : error.message);
    const next = mapPost(data);
    setPosts((current) => post.id ? current.map((item) => item.id === post.id ? { ...item, ...next, tags: post.tags } : item) : [next, ...current]);
    setEditor(null);
  };
  const deletePost = async (id) => { const { error } = await supabase.from('posts').delete().eq('id', id); if (error) setLoadError(error.message); else setPosts((current) => current.filter((item) => item.id !== id)); };
  const saveProfile = async (changes) => { const { data, error } = await supabase.from('profiles').update(changes).eq('id', user.id).select('*').single(); if (error) throw error; setProfile(data); };
  const uploadProfileImage = async (file) => {
    if (file.size > 8 * 1024 * 1024) { setLoadError('Images must be 8 MB or smaller.'); return null; }
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${user.id}/profile-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('blog-media').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) { setLoadError(error.message); return null; }
    return supabase.storage.from('blog-media').getPublicUrl(path).data.publicUrl;
  };
  const uploadImage = async (file) => {
    if (!user) { setLoginOpen(true); throw new Error('Sign in before uploading story media.'); }
    if (file.size > 8 * 1024 * 1024) throw new Error('Images and GIFs must be 8 MB or smaller.');
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('blog-media').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) {
      const message = error.message === 'Bucket not found'
        ? 'Media storage is not configured. Run supabase/migrations/007_ensure_blog_media_bucket.sql in the Supabase SQL Editor, then try again.'
        : `Media upload failed: ${error.message}`;
      throw new Error(message);
    }
    return supabase.storage.from('blog-media').getPublicUrl(path).data.publicUrl;
  };
  if (!isSupabaseConfigured) return <div className="min-h-screen bg-[#fbfcfa] px-4 py-24 dark:bg-black"><div className="mx-auto max-w-xl rounded-3xl border bg-white p-8 text-center shadow-sm dark:bg-gray-900"><LockKeyhole className="mx-auto mb-5 text-green-500" size={34} /><h1 className="text-3xl font-black">Blog backend not configured</h1><p className="mt-4 text-gray-500">Add the Supabase values from <code>.env.example</code> to enable secure authentication, database-backed posts, comments, and engagement.</p><Button onClick={onClose} className="mt-8 bg-green-500 text-black hover:bg-green-400">Back to portfolio</Button></div></div>;
  if (loading) return <div className="min-h-screen px-4 py-32 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-500/20 border-t-green-500" /><p className="mt-4 text-sm text-gray-500">Loading the latest writing…</p></div>;
  if (loadError && posts.length === 0) return <div className="min-h-screen px-4 py-32 text-center"><h1 className="text-2xl font-bold">We couldn’t load the blog</h1><p className="mt-3 text-sm text-gray-500">{loadError}</p></div>;
  const requireUser = (mode = 'login') => { if (!user) { setLoginMode(mode); setLoginOpen(true); return false; } return true; };
  const onLike = async (post) => { if (!requireUser()) return; const { error } = post.liked ? await supabase.from('post_likes').delete().match({ post_id: post.id, user_id: user.id }) : await supabase.from('post_likes').upsert({ post_id: post.id, user_id: user.id }); if (!error) { const next = { ...post, liked: !post.liked, likes: Math.max(0, post.likes + (post.liked ? -1 : 1)) }; updatePost(next); setSelected(next); await supabase.from('posts').update({ likes: next.likes }).eq('id', post.id); } };
  const onBookmark = async (post) => { if (!requireUser()) return; const table = supabase.from('bookmarks'); const action = post.bookmarked ? table.delete().match({ post_id: post.id, user_id: user.id }) : table.upsert({ post_id: post.id, user_id: user.id }); const { error } = await action; if (!error) { const next = { ...post, bookmarked: !post.bookmarked }; updatePost(next); setSelected(next); } };
  const onComment = async (postId, body, parentId) => { if (!requireUser('signup')) return; const { data, error } = await supabase.from('comments').insert({ post_id: postId, author_id: user.id, body, parent_id: parentId || null }).select('id, body, created_at, profiles(display_name)').single(); if (!error) { const next = { ...selected, comments: [...(selected.comments || []), { ...data, author: data.profiles?.display_name || user.email }] }; updatePost(next); setSelected(next); } };
  const filterLabels = { all: 'All posts', liked: 'Liked posts', saved: 'Saved posts' };
  const filterIcons = { all: FileText, liked: Heart, saved: Bookmark };
  const ActiveFilterIcon = filterIcons[postFilter];
  if (selected) return <div className="min-h-screen bg-white text-gray-950 dark:bg-black dark:text-white"><PostDetail post={selected} posts={posts} user={user} onBack={() => setSelected(null)} onUpdate={(next) => { updatePost(next); setSelected(next); }} onLike={onLike} onBookmark={onBookmark} onComment={onComment} onRequireSignup={() => requireUser('signup')} />{loginOpen && <LoginModal initialMode={loginMode} onClose={() => setLoginOpen(false)} onLogin={() => setLoginOpen(false)} />}</div>;
  return <div className="min-h-screen bg-[#fbfcfa] text-gray-950 dark:bg-black dark:text-white"><header className="border-b bg-white/80 px-4 py-5 backdrop-blur dark:border-gray-800 dark:bg-black/70 md:px-8"><div className="mx-auto flex max-w-6xl items-center"><button onClick={onClose} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-500"><ArrowLeft size={17} /> Portfolio</button><span className="ml-4 text-sm font-bold">Writing desk</span></div></header>
    <div className="border-b bg-white/60 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/60 md:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-2 max-[640px]:justify-start"><div className="relative"><Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-500 hover:text-black" onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen}>        <ActiveFilterIcon size={15} className="mr-1" /> {filterLabels[postFilter]} <ChevronDown size={15} className="ml-1" /></Button>{filterOpen && <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-2xl border bg-white p-2 shadow-xl dark:bg-gray-900"><button onClick={() => { setPostFilter('all'); setFilterOpen(false); setDashboard(false); setSelected(null); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${postFilter === 'all' ? 'bg-green-500 text-black' : 'text-green-600 hover:bg-green-500 hover:text-black'}`}><FileText size={15} /> All posts</button><button onClick={() => { setPostFilter('liked'); setFilterOpen(false); setDashboard(false); setSelected(null); }} className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-sm ${postFilter === 'liked' ? 'bg-green-500 text-black' : 'text-green-600 hover:bg-green-500 hover:text-black'}`}><Heart size={15} className="mr-2 inline" /> Liked posts</button><button onClick={() => { setPostFilter('saved'); setFilterOpen(false); setDashboard(false); setSelected(null); }} className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-sm ${postFilter === 'saved' ? 'bg-green-500 text-black' : 'text-green-600 hover:bg-green-500 hover:text-black'}`}><Bookmark size={15} className="mr-2 inline" /> Saved posts</button></div>}</div>{admin && <><Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-500 hover:text-black" onClick={() => setEditor({})}><Plus size={16} className="mr-1" /> New post</Button><Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-500 hover:text-black" onClick={() => setDashboard(!dashboard)}><Pencil size={16} className="mr-1" /> Dashboard</Button></>}        <div>{user ? <UserMenu user={user} profile={profile} admin={admin} onProfile={() => setProfileOpen(true)} onSignOut={async () => { await supabase.auth.signOut(); setDashboard(false); }} /> : <Button onClick={() => { setLoginMode('login'); setLoginOpen(true); }} className="bg-green-500 text-black hover:bg-green-400">Sign in</Button>}</div></div></div>
    {dashboard ? <Dashboard posts={posts} onNew={() => setEditor({})} onEdit={setEditor} onDelete={deletePost} onOpen={openPost} /> : <main className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-8"><div className="mb-14 max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-600"><Sparkles size={14} /> Notes from the build</div><h1 className="text-5xl font-black tracking-tight md:text-7xl">Ideas for building<br /><span className="text-green-500">better software.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">Thoughts on AI, backend systems, design, and the messy, rewarding work of shipping products people love.</p></div><div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full max-w-md"><Search className="absolute left-4 top-3.5 text-gray-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…" className="w-full rounded-full border bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900" /></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-gray-950 text-white dark:bg-white dark:text-black' : 'border text-gray-500 hover:border-green-500 hover:text-green-500'}`}>{item}</button>)}</div></div>{featured && <button onClick={() => openPost(featured)} className="mb-12 grid w-full overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 md:grid-cols-[1.2fr_1fr]">    <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-green-300 via-emerald-500 to-gray-950 p-8 text-white md:p-12">{featured.coverUrl && <img src={featured.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-br from-green-950/70 via-emerald-900/60 to-black/80" /><div className="relative"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">Featured story</span><div className="mt-24 max-w-lg"><h2 className="text-3xl font-black md:text-4xl">{featured.title}</h2>    <p className="mt-3 text-white/80">{featured.excerpt}</p></div></div></div><div className="flex flex-col justify-between p-8 md:p-12"><div><p className="text-sm text-gray-500">{formatDate(featured.publishedAt)} · {featured.readTime} min read</p><div className="mt-8 flex flex-wrap gap-2">{featured.tags.map((tag) => <span key={tag} className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">#{tag}</span>)}</div></div><span className="mt-8 flex items-center gap-2 text-sm font-bold text-green-600">Read the story <ArrowLeft size={16} className="rotate-180" /></span></div></button>}<div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-black">Latest writing</h2><span className="text-sm text-gray-500">{filtered.length} articles</span></div><div className="grid gap-5 md:grid-cols-2">{filtered.filter((post) => post.id !== featured?.id).map((post) =>     <button key={post.id} onClick={() => openPost(post)} className="overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-1 hover:border-green-500 hover:shadow-lg dark:bg-gray-900">{post.coverUrl && <img src={post.coverUrl} alt="" className="h-44 w-full object-cover" />}<div className="p-6"><div className="mb-12 flex items-center justify-between text-xs text-gray-500"><span className="font-semibold text-green-600">{post.category}</span><span>{formatDate(post.publishedAt)}</span></div><h3 className="text-xl font-black">{post.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">{post.excerpt}</p><div className="mt-6 flex items-center justify-between text-xs text-gray-500"><span className="flex items-center gap-1"><Eye size={14} /> {post.views}</span><span>{post.readTime} min read</span>    <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span></div></div></button>)}</div>{filtered.length === 0 && <div className="rounded-2xl border border-dashed p-16 text-center"><Tag className="mx-auto mb-4 text-gray-400" /><h3 className="font-bold">No stories found</h3><p className="mt-2 text-sm text-gray-500">Try another search or category.</p></div>}</main>}
    {loginOpen && <LoginModal initialMode={loginMode} onClose={() => setLoginOpen(false)} onLogin={() => setLoginOpen(false)} />}{profileOpen && <ProfileModal profile={profile} onClose={() => setProfileOpen(false)} onSave={saveProfile} onUpload={uploadProfileImage} />}{editor && <Editor post={editor.id ? editor : null} onClose={() => setEditor(null)} onSave={savePost} onUploadImage={uploadImage} />}
  </div>;
}
