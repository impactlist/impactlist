import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import PageHeader from './PageHeader';

/**
 * The scaffold shared by the list-style pages (Causes, Recipients,
 * Calculator): back button, fade-in page container, header, and the animated
 * content container. Previously repeated verbatim per page.
 */
const ListPageShell = ({
  title,
  subtitle,
  backTo = '/',
  backLabel = 'Back to top donors',
  className = '',
  children,
}) => (
  <>
    <BackButton to={backTo} label={backLabel} />
    <motion.div
      className={`impact-page flex flex-col items-center ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader title={title} subtitle={subtitle} />

      <motion.div
        className="impact-page__container mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  </>
);

ListPageShell.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backTo: PropTypes.string,
  backLabel: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ListPageShell;
