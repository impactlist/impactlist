import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from './PageHeader';
import BackButton from './BackButton';

const FAQ = () => {
  return (
    <>
      <BackButton to="/" label="Back to top donors" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <PageHeader title="FAQ" subtitle="Answers to frequently asked questions" />

        <motion.div
          className="max-w-4xl mx-auto px-4 py-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What is Impact List?</h3>
                <p className="text-gray-600">
                  Impact List is a project that aims to build and maintain a list which ranks the top ~1,000 living
                  people by their positive impact on the world via donations. We do this by building a database of
                  donations, making estimates about the effectiveness of those donations, and trying to present this
                  data in a useful way.
                </p>
                <br />
                <p className="text-gray-600">
                  The site also contains a{' '}
                  <a href="/calculator" className="text-blue-600 hover:text-blue-800 underline">
                    calculator
                  </a>{' '}
                  which you can use to estimate the impact of your past or future donations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What is the goal of Impact List?</h3>
                <p className="text-gray-600">
                  The goal is to make the list popular enough to increase the status awarded to those who rank highly,
                  bring more awareness to the importance of donation effectiveness, and ultimately cause people to
                  donate more effectively and/or donate more money to effective causes. See{' '}
                  <a
                    href="https://forum.effectivealtruism.org/posts/LCJa4AAi7YBcyro2H/proposal-impact-list-like-the-forbes-list-except-for-impact"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    this description of the project
                  </a>{' '}
                  for details.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  The donation effectiveness estimates seem arbitrary. Why should I trust them?
                </h3>
                <p className="text-gray-600">
                  This project is in its extreme early stages, and is essentially a proof of concept. Almost all of the
                  work has gone into building the site itself, and so far almost no work has gone into the effectiveness
                  estimates. If you disagree with any assumptions you can use the 'Adjust Assumptions' button to use
                  your own effectiveness estimates.
                </p>
                <br />
                <p className="text-gray-600">
                  We'd love to get some volunteers to help with effectiveness estimates. If you'd like to help, see{' '}
                  <a
                    href="https://github.com/impactlist/impactlist/blob/main/CONTRIBUTING.md"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    here
                  </a>{' '}
                  for how to get started, and join our{' '}
                  <a href="https://discord.gg/6GNre8U2ta" className="text-blue-600 hover:text-blue-800 underline">
                    Discord
                  </a>{' '}
                  .
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How does it make sense to estimate the lives saved of a charity that doesn't try to save lives?
                </h3>
                <p className="text-gray-600">
                  We use the concept of a{' '}
                  <a
                    href="https://en.wikipedia.org/wiki/Quality-adjusted_life_year"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    quality adjusted life year (QALY)
                  </a>{' '}
                  to estimate the lives saved of a donation. One QALY represents the value of a life year lived in good
                  health. To compare different cause areas, we need to convert the effects of charities into QALYs.
                </p>
                <br />
                <p className="text-gray-600">
                  For instance, if a charity cures someone's blindness or educates a child, we need to estimate some
                  amount of QALYs that this is equivalent to. This inherently involves approximations and uncertainty,
                  but we think it's better than not trying to compare them at all.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How can I get involved?</h3>
                <p className="text-gray-600">
                  We're actively seeking volunteers to help with the project. We're looking for people to research the
                  effectiveness of different categories of donations, the effectiveness of specific organizations, and
                  which donations individuals on the list have made (this includes adding new people to our list). We're
                  also looking for React developers to help with the website. If you think you can help in other ways
                  not mentioned here, please reach out. Join our{' '}
                  <a href="https://discord.gg/6GNre8U2ta" className="text-blue-600 hover:text-blue-800 underline">
                    Discord
                  </a>{' '}
                  and check out our{' '}
                  <a
                    href="https://github.com/impactlist/impactlist"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    GitHub repository
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How can I stay updated?</h3>
                <p className="text-gray-600">
                  Keep up with the latest developments by following us on{' '}
                  <a href="https://x.com/impactlist_" className="text-blue-600 hover:text-blue-800 underline">
                    Twitter
                  </a>
                  . We haven't posted much yet because we haven't officially launched, but once we do this will be the
                  primary way we post updates.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How can I contact you?</h3>
                <p className="text-gray-600">Email elliotolds at {`[Google's email service]`} with any questions.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FAQ;
