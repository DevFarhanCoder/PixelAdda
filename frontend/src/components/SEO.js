import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, keywords = [], image, url }) {
  const siteName = "PixelAdda";
  const defaultDescription =
    "Download premium design assets, vectors, templates, and more. High-quality resources for designers and creatives.";
  const defaultKeywords = [
    "design assets",
    "vectors",
    "templates",
    "graphics",
    "freepik alternative",
    "design marketplace",
  ];

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaKeywords = [...defaultKeywords, ...keywords].join(", ");
  const metaImage = image || "/og-image.jpg";
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
}
