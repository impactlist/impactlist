import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

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
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default MarkdownContent;
