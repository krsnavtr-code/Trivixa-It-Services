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
  FaLinkedin,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getBlogPostBySlug, getPostsByCategory } from "../../api/blogApi";
import { motion } from "framer-motion";
import "github-markdown-css/github-markdown.css";

dayjs.extend(relativeTime);

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
        const response = await getPostsByCategory(categoryId, {
          exclude: excludePostId,
          limit: 3,
        });
        const related = response?.data?.posts || response?.posts || [];
        setRelatedPosts(Array.isArray(related) ? related : []);
      } catch (error) {
        setRelatedPosts([]);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] py-32 px-6 flex justify-center">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] flex items-center justify-center p-6">
        <div className="text-center bg-white dark:bg-white/5 p-12 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The article you are looking for might have been moved or deleted.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="px-8 py-3 bg-[#F47C26] text-white font-bold rounded-xl hover:bg-[#d5671f] transition-colors shadow-lg shadow-orange-500/30"
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
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

      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- Floating Navbar --- */}
      <header className="fixed top-6 left-0 right-0 z-40 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/blog")}
            className="pointer-events-auto group flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#F47C26] dark:hover:text-white bg-white/80 dark:bg-[#0a0f2d]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200 dark:border-white/10 hover:border-[#F47C26]/50 shadow-lg transition-all"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Back</span>
          </button>

          <button
            onClick={handleShare}
            className="pointer-events-auto flex items-center gap-2 text-[#F47C26] hover:text-white bg-white/80 dark:bg-[#0a0f2d]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200 dark:border-white/10 hover:bg-[#F47C26] transition-all shadow-lg"
          >
            <FaShareAlt /> <span className="font-semibold text-sm">Share</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* --- Article Content (Left/Center) --- */}
          <article className="lg:col-span-8">
            {/* Hero Image & Title Block */}
            <div className="relative rounded-3xl overflow-hidden mb-10 border border-gray-200 dark:border-white/10 shadow-2xl group">
              <div className="h-[300px] md:h-[450px] w-full bg-gray-200 dark:bg-[#05081a]">
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="px-3 py-1 bg-[#F47C26] text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-lg"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-[#F47C26]">
                      <FaUser className="text-xs" />
                    </div>
                    <span>{author?.name || "Trivixa Team"}</span>
                  </div>
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

            {/* Content Body */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
              <div
                className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#F47C26] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-[#F47C26] prose-code:bg-gray-100 dark:prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-gray-700 dark:prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-lg
                prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:marker:text-[#F47C26]
                prose-img:rounded-2xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-white/10 prose-img:shadow-md
                prose-blockquote:border-l-[#F47C26] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-3">
                    <FaTag className="text-[#F47C26]" />
                    {tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-[#F47C26] hover:text-white dark:hover:bg-[#F47C26] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* --- Sidebar (Right) --- */}
          <aside className="lg:col-span-4 space-y-8 sticky top-32 h-fit">
            {/* Author Profile */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
                About the Author
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F47C26] to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#0a0f2d] flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
                    {author?.name?.charAt(0) || "T"}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {author?.name || "Trivixa Team"}
                  </p>
                  <p className="text-xs text-[#F47C26] font-semibold uppercase tracking-wide">
                    Senior Engineer
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {author?.bio ||
                  "Sharing insights on scalable architecture, modern web development, and digital transformation strategies."}
              </p>

              <div className="flex gap-3">
                <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-blue-600 dark:text-white hover:bg-blue-600 hover:text-white transition-colors">
                  <FaLinkedin />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sky-500 dark:text-white hover:bg-sky-500 hover:text-white transition-colors">
                  <FaTwitter />
                </button>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F47C26] rounded-full"></span>
                  Related Insights
                </h3>

                {/* Visual Aid for Related Concepts */}
                <div className="mb-6 opacity-80 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
                  [Image of software architecture patterns]
                </div>

                <div className="space-y-6">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={
                              post.featuredImage ||
                              "/images/blog-placeholder.jpg"
                            }
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#F47C26] transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <FaClock className="text-[#F47C26]" />{" "}
                            {Math.ceil(post.readingTime || 5)} min read
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </motion.div>
      </main>
    </div>
  );
}
