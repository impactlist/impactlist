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
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-4">
                Impact List is a project that aims to build and maintain a list which ranks the top ~100 living people
                by their positive impact on the world via donations.
              </p>
              <p className="text-gray-600 mb-4">
                The goal is to make the list popular enough to increase the status awarded to those who rank highly,
                bring more awareness to the importance of donation effectiveness, and ultimately cause people to donate
                more effectively and/or donate more money to effective causes.
              </p>
              <p className="text-gray-600 mb-4">
                See{' '}
                <a
                  href="https://forum.effectivealtruism.org/posts/LCJa4AAi7YBcyro2H/proposal-impact-list-like-the-forbes-list-except-for-impact"
                  className="text-blue-600 hover:text-blue-800"
                >
                  this description of the project
                </a>{' '}
                for details.
              </p>
              <p className="text-gray-600 mb-4">
                We're actively seeking volunteers to help with the project. Join the{' '}
                <a href="https://discord.gg/6GNre8U2ta" className="text-blue-600 hover:text-blue-800">
                  discord
                </a>{' '}
                to see how you can get involved, or check us out on{' '}
                <a href="https://github.com/impactlist/impactlist" className="text-blue-600 hover:text-blue-800">
                  github
                </a>
                .
              </p>
              <p className="text-gray-600 mb-4">
                Keep up with the latest developments by following us on{' '}
                <a href="https://x.com/impactlist_" className="text-blue-600 hover:text-blue-800">
                  Twitter
                </a>
                .
              </p>
              <p className="text-gray-600">Email elliotolds at {`[Google's email service]`} with any questions.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FAQ;
