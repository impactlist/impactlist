import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/shared/PageHeader';
import BackButton from '../components/shared/BackButton';

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
                  How do you calculate the effectiveness of different charities?
                </h3>
                <p className="text-gray-600">
                  Initially we've mostly focused on calculating the effectiveness of different{' '}
                  <strong>categories</strong> of donations, such as global health, poverty, animal welfare, etc. We
                  currently have 27 categories. You can see the effectiveness estimates for each category by going{' '}
                  <a href="/categories" className="text-blue-600 hover:text-blue-800 underline">
                    here
                  </a>{' '}
                  and then clicking on the category you're interested in. The site also supports specifying the
                  effectiveness of specific charities. We've only done that for a handful so far, but plan to add more
                  in the future.
                </p>
                <br />
                <p className="text-gray-600">
                  Because we have very few staff, we've initially made heavy use of large language models (mostly
                  ChatGPT 5.1 Thinking) to help us with the estimation process. We encourage the LLMs to make use of
                  existing work by organizations such as{' '}
                  <a href="https://www.givewell.org/" className="text-blue-600 hover:text-blue-800 underline">
                    GiveWell
                  </a>{' '}
                  and{' '}
                  <a href="https://www.openphilanthropy.org/" className="text-blue-600 hover:text-blue-800 underline">
                    Open Philanthropy
                  </a>
                  , who have already done a lot of the hard work of estimating charity effectiveness. We plan to refine
                  our estimates over time with human experts.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  The charity effectiveness estimates seem arbitrary. Why should I trust them?
                </h3>
                <p className="text-gray-600">
                  Our goal is to make the assumptions and the details of the calculations as transparent as possible. We
                  encourage you to read the justifications for the effectiveness estimates for each category, and see if
                  they seem reasonable to you. If not, you have a few options:
                  <br />
                  <br />
                  (1) Use the 'Adjust Assumptions' button on the top right of most pages on this site. This gives you
                  full control over the assumptions to see how your preferred values would affect the rankings.
                  <br />
                  (2) Help us improve the estimates. Email us (see below) or join our{' '}
                  <a href="https://discord.gg/6GNre8U2ta" className="text-blue-600 hover:text-blue-800 underline">
                    Discord
                  </a>{' '}
                  and let us know why you disagree and we may incorporate your feedback into the estimates. You can also
                  help us improve the estimates more directly by making a{' '}
                  <a
                    href="https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    github pull request
                  </a>
                  {'.'}
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
                  For instance, if a charity cures someone's blindness we would need to estimate how much better their
                  life is per year now that they can see, as a fraction of a life year. We might estimate that a year of
                  not being able to see is 15% less good than a year of being able to see. So curing someone's blindness
                  for a year is equivalent to 0.15 QALYs. We would then multiply this by the amount of years we expect
                  them to be able to see for. If we expect them to be able to see for 10 years, then we would estimate
                  that curing their blindness is equivalent to 1.5 QALYs.
                  <br />
                  <br />
                  This process inherently involves approximations and a lot of uncertainty, but we think it's better
                  than not trying to compare different charitable causes at all.
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
