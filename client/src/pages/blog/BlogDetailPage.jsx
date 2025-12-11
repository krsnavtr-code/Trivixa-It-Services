import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaArrowLeft,
  FaShareAlt,
  FaHashtag,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getBlogPostBySlug, getPostsByCategory } from "../../api/blogApi";
import { motion } from "framer-motion";
import "github-markdown-css/github-markdown.css";
import "./BlogDetailPage.css"; // Ensure this CSS handles dark mode markdown styles if needed

dayjs.extend(relativeTime);

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await getBlogPostBySlug(slug);
        const postData = response?.data?.post || response?.post;

        if (!postData) throw new Error("No post data received");

        setPost(postData);

        if (postData?.categories?.length > 0) {
          fetchRelatedPosts(postData.categories[0]._id, postData._id);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load article.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedPosts = async (categoryId, excludePostId) => {
      try {
        setIsRelatedLoading(true);
        const response = await getPostsByCategory(categoryId, {
          exclude: excludePostId,
          limit: 3,
        });
        const related = response?.data?.posts || response?.posts || [];
        setRelatedPosts(Array.isArray(related) ? related : []);
      } catch (error) {
        setRelatedPosts([]);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!"); // Replaced AntD message with standard alert or toast
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f2d] py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="h-64 bg-white/5 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
            <div className="h-4 bg-white/5 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0f2d] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Article Not Found
          </h2>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-2 bg-[#F47C26] text-white rounded-lg hover:bg-[#d5671f] transition-colors"
          >
            Back to Insights
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    excerpt,
    featuredImage,
    author,
    createdAt,
    categories,
    tags,
    readingTime,
  } = post;

  return (
    <div className="min-h-screen bg-[#0a0f2d] text-white relative overflow-hidden">
      <SEO
        title={`${title} | Trivixa Insights`}
        description={excerpt || "Read this engineering insight on Trivixa."}
        keywords={tags?.join(", ") || "tech blog, software engineering"}
        og={{
          title,
          description: excerpt,
          type: "article",
          image: featuredImage,
          url: window.location.href,
        }}
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- Header / Nav --- */}
      <header className="fixed top-20 left-0 right-0 z-40 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/blog")}
            className="pointer-events-auto flex items-center gap-2 text-gray-400 hover:text-white bg-[#0a0f2d]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-[#F47C26]/50 transition-all"
          >
            <FaArrowLeft /> <span className="hidden sm:inline">Back</span>
          </button>

          <button
            onClick={handleShare}
            className="pointer-events-auto flex items-center gap-2 text-[#F47C26] hover:text-white bg-[#0a0f2d]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-[#F47C26] transition-all"
          >
            <FaShareAlt /> <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12"
        >
          {/* --- Main Content (Left) --- */}
          <article className="lg:col-span-3">
            {/* Featured Image */}
            {featuredImage && (
              <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] via-transparent to-transparent opacity-80"></div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories?.map((cat) => (
                      <span
                        key={cat._id}
                        className="px-3 py-1 bg-[#F47C26] text-white text-xs font-bold uppercase tracking-wide rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 shadow-black drop-shadow-lg">
                    {title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-2">
                      <FaUser className="text-[#F47C26]" />{" "}
                      {author?.name || "Trivixa Team"}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#F47C26]" />{" "}
                      {dayjs(createdAt).format("MMM D, YYYY")}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-[#F47C26]" />{" "}
                      {Math.ceil(readingTime || 5)} min read
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Markdown Content */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
              <div
                className="prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-headings:font-bold 
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#F47C26] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-[#F47C26] prose-code:bg-black/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[#05081a] prose-pre:border prose-pre:border-white/10
                prose-li:text-gray-300 prose-li:marker:text-[#F47C26]
                prose-img:rounded-xl prose-img:border prose-img:border-white/10
              "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Tags Footer */}
              {tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-3">
                    <FaTag className="text-[#F47C26]" />
                    {tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-[#F47C26] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-[#F47C26] pl-4">
                  Related Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="group block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={
                            post.featuredImage || "/images/blog-placeholder.jpg"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-[#F47C26] transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <FaClock /> {Math.ceil(post.readingTime || 5)} min
                          read
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* --- Sidebar (Right) --- */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Author Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                About the Author
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F47C26] flex items-center justify-center text-white font-bold text-xl">
                  {author?.name?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="text-white font-bold">
                    {author?.name || "Trivixa Team"}
                  </p>
                  <p className="text-xs text-gray-400">Tech Contributor</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {author?.bio ||
                  "Expert insights from our engineering and design teams."}
              </p>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-[#F47C26]/20 to-purple-900/20 border border-[#F47C26]/30 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-xs text-gray-300 mb-4">
                Get the latest tech trends delivered to your inbox.
              </p>
              <button className="w-full py-2 bg-[#F47C26] text-white font-bold rounded-lg hover:bg-[#d5671f] transition-colors text-sm">
                Subscribe Now
              </button>
            </div>

            {/* Category List */}
            {categories?.length > 0 && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                  Topic Hubs
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        to={`/blog?category=${cat.slug}`}
                        className="flex justify-between items-center text-sm text-gray-400 hover:text-[#F47C26] hover:bg-white/5 p-2 rounded transition-all"
                      >
                        <span>{cat.name}</span>
                        <FaArrowLeft className="rotate-180 text-xs opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </motion.div>
      </main>
    </div>
  );
}
