import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link, useInRouterContext } from 'react-router-dom';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import InfoTooltipIcon from './InfoTooltipIcon';
import { CONTENT_TOOLTIPS } from '../../constants/contentTooltips';

// Markdown links whose href starts with this sentinel render the phrase as plain
// text followed by an info-icon tooltip, instead of a hyperlink. A `#`-fragment is
// used because react-markdown's default URL sanitizer preserves fragment hrefs (a
// custom `tooltip:` protocol would be stripped). The text after the prefix is a key
// into CONTENT_TOOLTIPS. Authored via the {{PLAUSIBLE_RANGE}} generator variable.
const TOOLTIP_HREF_PREFIX = '#tooltip:';

// Custom link component that opens external links in a new tab and styles all links blue
// eslint-disable-next-line no-unused-vars
const CustomLink = ({ node, href, title, children }) => {
  const isInRouterContext = useInRouterContext();
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
  const isInternalRoute = href && href.startsWith('/') && !href.startsWith('//');
  const linkClass = 'impact-link';

  if (href && href.startsWith(TOOLTIP_HREF_PREFIX)) {
    const content = CONTENT_TOOLTIPS[href.slice(TOOLTIP_HREF_PREFIX.length)];
    if (content) {
      const term =
        typeof children === 'string'
          ? children
          : Array.isArray(children)
            ? children.filter((child) => typeof child === 'string').join('')
            : '';
      // `nowrap` keeps the info icon glued to the end of the phrase rather than
      // orphaning onto the next line.
      return (
        <span className="impact-glossary">
          {children}
          <InfoTooltipIcon
            content={content}
            className="impact-glossary__info"
            iconClassName="h-3 w-3"
            ariaLabel={term ? `${term} definition` : 'Definition'}
          />
        </span>
      );
    }
    // Unknown key: render the phrase as plain text. The authoring token guarantees a
    // valid key, so this only guards against a hand-written typo rather than shipping a
    // broken-looking link.
    return <span>{children}</span>;
  }

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

// Renders `:::details{title="…"}` container directives as a native, collapsed
// <details>/<summary> block. The body stays ordinary markdown, so math, links, and
// tooltips inside it render normally — letting a deep derivation sit behind a click
// instead of burying the main line of argument (see content/CLAUDE.md and the
// effectiveness-estimation skill). `:::details` is the only directive we wire up.
const remarkCollapsibleDetails = () => (tree) => {
  const transform = (node) => {
    if (node.type === 'containerDirective' && node.name === 'details') {
      const title = node.attributes?.title?.trim() || 'Details';
      node.data = { ...node.data, hName: 'details', hProperties: { className: 'impact-details' } };
      node.children.unshift({
        type: 'paragraph',
        data: { hName: 'summary', hProperties: { className: 'impact-details__summary' } },
        children: [{ type: 'text', value: title }],
      });
    }
    node.children?.forEach(transform);
  };
  transform(tree);
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
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkDirective, remarkCollapsibleDetails]}
          rehypePlugins={[rehypeKatex]}
          components={{ a: CustomLink }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default MarkdownContent;
