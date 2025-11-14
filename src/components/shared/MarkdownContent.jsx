import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const MarkdownContent = ({ content, className = '', delay = 0.2 }) => {
  if (!content) {
    return null;
  }

  return (
    <motion.div
      className={`bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6 ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="prose prose-slate max-w-none prose-headings:text-slate-700 prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-4 prose-h2:text-lg prose-h2:font-semibold prose-h2:text-slate-600 prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-600 prose-h3:mb-2">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default MarkdownContent;
