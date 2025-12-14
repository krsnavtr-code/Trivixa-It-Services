import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { getBlogPosts } from "../../api/blogApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaTag,
} from "react-icons/fa";

dayjs.extend(relativeTime);

export default function BlogListPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 9;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts({
          page,
          limit: pageSize,
          status: "published",
        });
        setPosts(response.data?.posts || []);
        setTotal(response.data?.total || 0);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPostCard = (post) => (
    <motion.div
      variants={itemVariants}
      key={post._id}
      className="group flex flex-col bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 dark:hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2 dark:shadow-none"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="block relative h-52 overflow-hidden bg-gray-100 dark:bg-[#05081a]"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 dark:text-white/20 text-4xl font-bold uppercase tracking-widest">
              Trivixa
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"></div>

        {/* Category Badge */}
        {post.categories?.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#F47C26]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-lg border border-white/20">
              {post.categories[0].name}
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        {/* Meta Data */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-[#F47C26]" />
            {dayjs(post.createdAt).format("MMM D, YYYY")}
          </span>
          <span className="flex items-center gap-1.5">
            <FaClock className="text-[#F47C26]" />
            {Math.ceil(post.readingTime || 5)} min read
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#F47C26] transition-colors leading-tight">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow leading-relaxed">
          {post.excerpt ||
            post.content?.substring(0, 150).replace(/<[^>]*>?/gm, "") + "..."}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500 font-semibold">
              By Trivixa Team
            </span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-xs font-bold text-[#F47C26] uppercase tracking-wide group-hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Read Article{" "}
            <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Tech Insights | Trivixa IT Solutions"
        description="Explore the latest trends in software development, cloud architecture, and digital transformation. Expert insights from the Trivixa engineering team."
        keywords="tech blog, software engineering insights, IT trends, web development tutorials, Trivixa blog"
        og={{
          title: "Trivixa Insights - Engineering the Future",
          description:
            "Deep dives into code, cloud, and culture. Read the latest from our tech experts.",
          type: "website",
        }}
      />

      {/* --- Sci-Fi Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* --- Header --- */}
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
              Blog & News
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Engineering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Insights
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Thoughts on technology, design, and business innovation. Stay
              ahead of the curve.
            </p>

            {/* Search Bar (Visual Placeholder) */}
            <div className="mt-10 max-w-md mx-auto relative hidden md:block">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F47C26]/50 focus:border-[#F47C26] transition-all shadow-sm dark:shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* --- Content Area --- */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                  ></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {posts.map(renderPostCard)}
                </motion.div>

                {/* Pagination */}
                <div className="mt-20 flex justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-6 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
                    Page {page}
                  </div>
                  <button
                    disabled={posts.length < pageSize}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-6 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
                  <FaTag className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Check back later for new updates.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
