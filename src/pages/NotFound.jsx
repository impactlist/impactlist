import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';

/**
 * Shown for unknown URLs and for detail pages whose entity ID doesn't exist.
 * Bad links are expected input (stale bookmarks, typos), so they get a real
 * page instead of the developer error screen.
 */
const NotFound = ({ message = "The page you're looking for doesn't exist." }) => {
  useDocumentTitle('Page not found');

  return (
    <motion.div
      className="impact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="impact-page__container py-16 text-center">
        <h1 className="impact-page__title mb-4">Page not found</h1>
        <p className="text-muted mb-8">{message}</p>
        <Link to="/" className="impact-btn impact-btn--custom-accent inline-flex items-center">
          Back to the Impact List
        </Link>
      </div>
    </motion.div>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
};

export default NotFound;
