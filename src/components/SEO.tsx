import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noIndex?: boolean;
}

export default function SEO({
  title = 'AG Handloom - Authentic Traditional Handloom Products',
  description = 'Discover authentic traditional handloom products. Ethically sourced, handcrafted with care. Free shipping on orders over ₹1000.',
  keywords = 'handloom, traditional textiles, sarees, Indian handloom, ethical fashion',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  canonical,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Get the current meta tags
    const metaTags = document.getElementsByTagName('meta');
    const metaSelectors = {
      description: 'meta[name="description"]',
      keywords: 'meta[name="keywords"]',
      robots: 'meta[name="robots"]',
      ogType: 'meta[property="og:type"]',
      ogTitle: 'meta[property="og:title"]',
      ogDescription: 'meta[property="og:description"]',
      ogImage: 'meta[property="og:image"]',
      ogUrl: 'meta[property="og:url"]',
      twitterCard: 'meta[name="twitter:card"]',
      twitterTitle: 'meta[name="twitter:title"]',
      twitterDescription: 'meta[name="twitter:description"]',
      twitterImage: 'meta[name="twitter:image"]',
    };
    
    // Helper to set or create meta tags
    const setMetaTag = (selector: string, attributeName: string, content: string) => {
      const element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute('content', content);
      } else {
        const metaTag = document.createElement('meta');
        const isOg = selector.includes('og:');
        if (isOg) {
          metaTag.setAttribute('property', attributeName);
        } else {
          metaTag.setAttribute('name', attributeName);
        }
        metaTag.setAttribute('content', content);
        document.head.appendChild(metaTag);
      }
    };
    
    // Set all meta tags
    const siteUrl = window.location.origin;
    const pageUrl = canonical || window.location.href;
    
    setMetaTag(metaSelectors.description, 'description', description);
    setMetaTag(metaSelectors.keywords, 'keywords', keywords);
    
    // Robots meta tag
    if (noIndex) {
      setMetaTag(metaSelectors.robots, 'robots', 'noindex, nofollow');
    }
    
    // Open Graph tags
    setMetaTag(metaSelectors.ogType, 'og:type', ogType);
    setMetaTag(metaSelectors.ogTitle, 'og:title', title);
    setMetaTag(metaSelectors.ogDescription, 'og:description', description);
    setMetaTag(metaSelectors.ogImage, 'og:image', `${siteUrl}${ogImage}`);
    setMetaTag(metaSelectors.ogUrl, 'og:url', pageUrl);
    
    // Twitter tags
    setMetaTag(metaSelectors.twitterCard, 'twitter:card', 'summary_large_image');
    setMetaTag(metaSelectors.twitterTitle, 'twitter:title', title);
    setMetaTag(metaSelectors.twitterDescription, 'twitter:description', description);
    setMetaTag(metaSelectors.twitterImage, 'twitter:image', `${siteUrl}${ogImage}`);
    
    // Canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalElement) {
      canonicalElement.href = pageUrl;
    } else {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      canonicalElement.href = pageUrl;
      document.head.appendChild(canonicalElement);
    }
    
    // Structured Data for Products
    if (ogType === 'product') {
      let scriptElement = document.getElementById('product-schema') as HTMLScriptElement;
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      
      scriptElement = document.createElement('script');
      scriptElement.id = 'product-schema';
      scriptElement.type = 'application/ld+json';
      scriptElement.innerHTML = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title.replace(' - AG Handloom', ''),
        "description": description,
        "image": `${siteUrl}${ogImage}`,
        "url": pageUrl
      });
      document.head.appendChild(scriptElement);
    }
    
    // Structured Data for Website
    if (ogType === 'website') {
      let scriptElement = document.getElementById('website-schema') as HTMLScriptElement;
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      
      scriptElement = document.createElement('script');
      scriptElement.id = 'website-schema';
      scriptElement.type = 'application/ld+json';
      scriptElement.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AG Handloom",
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      });
      document.head.appendChild(scriptElement);
    }
    
    // Clean up function
    return () => {
      // Remove any schema scripts added by this component when unmounting
      const productSchema = document.getElementById('product-schema');
      const websiteSchema = document.getElementById('website-schema');
      
      if (productSchema && ogType !== 'product') {
        document.head.removeChild(productSchema);
      }
      
      if (websiteSchema && ogType !== 'website') {
        document.head.removeChild(websiteSchema);
      }
    };
  }, [title, description, keywords, ogImage, ogType, canonical, noIndex]); // Dependencies for the effect
  
  // This component doesn't render anything visible
  return null;
}
