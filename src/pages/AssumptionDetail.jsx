import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import MarkdownContent from '../components/shared/MarkdownContent';
import NotFound from './NotFound';
import { assumptionsById } from '../data/generatedData';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AssumptionDetail = () => {
  const { assumptionId } = useParams();
  const assumption = assumptionsById[assumptionId];
  useDocumentTitle(assumption?.name);

  if (!assumption) {
    return <NotFound message={`No assumption found with ID "${assumptionId}".`} />;
  }

  return (
    <motion.div
      className="impact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton />

      <motion.div
        className="impact-page__container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="impact-page__title">{assumption.name}</h1>

        <MarkdownContent content={assumption.content} className="mt-8 mb-8" />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionDetail;
