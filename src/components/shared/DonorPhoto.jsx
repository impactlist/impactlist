import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  small: 'w-20 h-20 rounded',
  featured: 'w-28 h-28 rounded-md shadow-sm',
  large: 'w-48 h-48 rounded-lg shadow-md border border-slate-200',
};

/**
 * Displays a donor photo with fallback handling.
 * Tries .jpeg first, then .jpg, then falls back to unknown.jpeg.
 */
const DonorPhoto = ({ donorId, donorName, size = 'small', className = '' }) => {
  const [imageSrc, setImageSrc] = useState(`/images/people/small/${donorId}.jpeg`);
  const [triedJpg, setTriedJpg] = useState(false);

  // Reset the photo source when the donor changes so sorting keeps photos aligned
  useEffect(() => {
    setImageSrc(`/images/people/small/${donorId}.jpeg`);
    setTriedJpg(false);
  }, [donorId]);

  const handleError = () => {
    if (!triedJpg) {
      setTriedJpg(true);
      setImageSrc(`/images/people/small/${donorId}.jpg`);
    } else {
      setImageSrc('/images/people/small/unknown.jpeg');
    }
  };

  const sizeClass = sizeClasses[size] || sizeClasses.small;

  return (
    <img
      src={imageSrc}
      alt={donorName}
      className={`shrink-0 object-cover ${sizeClass} ${className}`}
      onError={handleError}
    />
  );
};

DonorPhoto.propTypes = {
  donorId: PropTypes.string.isRequired,
  donorName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'featured', 'large']),
  className: PropTypes.string,
};

export default DonorPhoto;
