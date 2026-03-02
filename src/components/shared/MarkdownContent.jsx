import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Custom link component that opens external links in a new tab and styles all links blue
// eslint-disable-next-line no-unused-vars
const CustomLink = ({ node, href, children, ...props }) => {
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
  const linkClass = 'impact-link';

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={linkClass} {...props}>
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
      <div className="prose max-w-none prose-headings:text-strong prose-p:text-muted prose-li:text-muted prose-strong:text-strong prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-4 prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ a: CustomLink }}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default MarkdownContent;
