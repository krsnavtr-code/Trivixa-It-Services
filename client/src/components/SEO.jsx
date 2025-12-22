import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from "prop-types";

/**
 * SEO Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Page title (e.g., 'Home | Trivixa IT Solution')
 * @param {string} props.description - Meta description for the page (max 160 chars)
 * @param {string} [props.keywords] - Comma-separated keywords for SEO
 * @param {string} [props.canonical] - Canonical URL for the page
 * @param {string} [props.image] - Main image URL for social sharing
 * @param {string} [props.type] - Content type (e.g., 'website', 'article', 'profile')
 * @param {string} [props.locale] - Content locale (e.g., 'en_US')
 * @param {Object} [props.article] - Article specific metadata
 * @param {string} [props.article.publishedTime] - ISO date string
 * @param {string} [props.article.modifiedTime] - ISO date string
 * @param {string} [props.article.author] - Article author
 * @param {string} [props.article.section] - Article section/category
 * @param {string[]} [props.article.tags] - Article tags
 * @param {Object} [props.og] - Additional Open Graph meta tags
 * @param {Object} [props.twitter] - Twitter card meta tags
 * @returns {JSX.Element} - Returns Helmet component with meta tags
 */
const SEO = ({
  title = "Trivixa IT Solution - Software & Website Development Company",
  description = "Trivixa IT Solution is a professional IT services company offering website development, software solutions, mobile apps, UI/UX design, and digital transformation services for businesses.",
  keywords = "Trivixa IT Solution, software company, website development company, IT services, web development, mobile app development, software solutions, UI UX design, digital solutions, Noida, India",
  canonical = "",
  image = "",
  type = "website",
  locale = "en_US",
  article = null,
  og = {},
  twitter = {},
}) => {
  const siteName = "Trivixa IT Solution";
  const siteUrl = "https://trivixa.in";
  const defaultImage = `${siteUrl}/images/trivixa-fix-size-brand-logo.png`;
  const fullImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : defaultImage;
  const fullCanonical =
    canonical ||
    (typeof window !== "undefined" ? window.location.href : siteUrl);

  // Ensure description is properly truncated
  const metaDescription =
    description.length > 160
      ? `${description.substring(0, 157)}...`
      : description;

  // Default Open Graph values
  const ogTitle = og.title || title;
  const ogDescription = og.description || metaDescription;
  const ogImage = og.image || fullImageUrl;
  const ogType = og.type || type;
  const ogUrl = og.url || fullCanonical;

  // Default Twitter card values
  const twitterCard = twitter.card || "summary_large_image";
  const twitterSite = twitter.site || "@trivixait";
  const twitterCreator = twitter.creator || "@trivixait";
  const twitterImage = twitter.image || ogImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:locale" content={locale} />

      {/* Image Dimensions - important for social sharing */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={ogTitle} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* Article specific meta tags */}
      {article && article.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
        />
      )}
      {article && article.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article && article.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article && article.section && (
        <meta property="article:section" content={article.section} />
      )}
      {article &&
        article.tags &&
        article.tags.map((tag, index) => (
          <meta property="article:tag" content={tag} key={`tag-${index}`} />
        ))}

      {/* Additional Open Graph tags */}
      <meta property="og:site_name" content={siteName} />

      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta
        name="bingbot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.oneOf(["website", "article", "profile", "book"]),
  locale: PropTypes.string,
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    section: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  og: PropTypes.object,
  twitter: PropTypes.object,
};

export default SEO;
