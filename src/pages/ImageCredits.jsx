import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { imageCredits } from '../data/imageCredits';

// Sorted copy: never sort the imported array in place.
const sortedCredits = [...imageCredits].sort((a, b) => a.name.localeCompare(b.name));

const ImageCredits = () => {
  useDocumentTitle('Image Credits');

  return (
    <div className="impact-page">
      <PageHeader
        title="Image Credits"
        subtitle="Every photo on this site comes from a freely licensed source. Donors without a freely licensed photo are shown with a placeholder."
      />
      <div className="impact-page__container">
        <ul className="space-y-4">
          {sortedCredits.map((credit) => (
            <li key={credit.donorId} className="impact-surface flex items-center gap-4 p-4">
              <img
                src={`/images/people/small/${credit.donorId}.jpeg`}
                onError={(e) => {
                  // A handful of legacy files use .jpg
                  e.currentTarget.src = `/images/people/small/${credit.donorId}.jpg`;
                  e.currentTarget.onerror = null;
                }}
                alt={credit.name}
                className="w-12 h-12 rounded object-cover shrink-0"
              />
              <div className="min-w-0">
                <Link to={`/donor/${credit.donorId}`} className="impact-link font-medium">
                  {credit.name}
                </Link>
                <p className="text-sm text-[var(--text-muted)]">
                  Photo{credit.author ? ` by ${credit.author}` : ''}, via{' '}
                  <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="impact-link">
                    {credit.sourceName}
                  </a>
                  , licensed{' '}
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="impact-link">
                    {credit.license}
                  </a>
                  {/* CC licenses require indicating modifications (e.g. CC BY 4.0 §3(a)(1)(B)).
                      Every shipped photo is a square crop/resize of its source. */}
                  {(() => {
                    const modifications =
                      credit.modifications ??
                      (credit.license.startsWith('CC') ? 'cropped and resized from the original' : null);
                    return modifications ? `; ${modifications}` : '';
                  })()}
                  {credit.notes ? ` — ${credit.notes}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageCredits;
