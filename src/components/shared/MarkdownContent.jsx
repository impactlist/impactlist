import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link, useInRouterContext } from 'react-router-dom';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Custom link component that opens external links in a new tab and styles all links blue
// eslint-disable-next-line no-unused-vars
const CustomLink = ({ node, href, title, children }) => {
  const isInRouterContext = useInRouterContext();
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
  const isInternalRoute = href && href.startsWith('/') && !href.startsWith('//');
  const linkClass = 'impact-link';

  if (isExternal) {
    return (
      <a href={href} title={title} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    );
  }

  if (isInternalRoute && isInRouterContext) {
    return (
      <Link to={href} title={title} className={linkClass}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} title={title} className={linkClass}>
      {children}
    </a>
  );
};

const MarkdownContent = ({ content, className = '', delay = 0.2 }) => {
  if (!content) {
    return null;
  }

  return (
    <motion.div
      className={`impact-surface overflow-hidden p-6 ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="impact-markdown prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ a: CustomLink }}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default MarkdownContent;
