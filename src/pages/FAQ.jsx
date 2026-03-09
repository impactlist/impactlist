import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/shared/PageHeader';
import BackButton from '../components/shared/BackButton';
import { CAUSES_PATH } from '../utils/causeRoutes';

const FAQCard = ({ question, isOpen, onToggle, children }) => (
  <article className="impact-surface faq-card" data-open={isOpen}>
    <button
      type="button"
      className="faq-card__toggle"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={`${isOpen ? 'Collapse' : 'Expand'} question: ${question}`}
    >
      <span className="faq-card__question">{question}</span>
      <span className="faq-card__icon" aria-hidden={true}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          className="faq-card__content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="faq-card__content-inner">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </article>
);

FAQCard.propTypes = {
  question: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState(() => new Set([0]));

  const toggleItem = useCallback((index) => {
    setOpenItems((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  }, []);

  const isOpen = (index) => openItems.has(index);

  return (
    <>
      <BackButton to="/" label="Back to top donors" />
      <motion.div
        className="impact-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader title="FAQ" subtitle="Answers to frequently asked questions" />

        <motion.div
          className="impact-page__container impact-page__container--narrow py-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="impact-faq">
            <FAQCard question="What is Impact List?" isOpen={isOpen(0)} onToggle={() => toggleItem(0)}>
              <p className="mb-3">
                Impact List is a project that aims to build and maintain a list which ranks the top ~1,000 living people
                by their positive impact on the world via donations. We do this by building a database of donations,
                making estimates about the effectiveness of those donations, and trying to present this data in a useful
                way.
              </p>
              <p>
                The site also contains a{' '}
                <Link to="/calculator" className="impact-link">
                  calculator
                </Link>{' '}
                which you can use to estimate the impact of your past or future donations.
              </p>
            </FAQCard>

            <FAQCard question="What is the goal of Impact List?" isOpen={isOpen(1)} onToggle={() => toggleItem(1)}>
              <p>
                To make the list popular enough to increase the status awarded to those who rank highly, bring more
                awareness to the importance of donation effectiveness, and ultimately cause people to donate more
                effectively and/or donate more money to effective causes. See{' '}
                <a
                  href="https://forum.effectivealtruism.org/posts/LCJa4AAi7YBcyro2H/proposal-impact-list-like-the-forbes-list-except-for-impact"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this description of the project
                </a>{' '}
                for details.
              </p>
            </FAQCard>

            <FAQCard
              question="How can I send feedback about this site?"
              isOpen={isOpen(2)}
              onToggle={() => toggleItem(2)}
            >
              <p>
                Use{' '}
                <a
                  href="https://forms.gle/NEC6LNics3n6WVo47"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this form
                </a>
                .
              </p>
            </FAQCard>

            <FAQCard
              question="How do you calculate the effectiveness of different charities?"
              isOpen={isOpen(3)}
              onToggle={() => toggleItem(3)}
            >
              <p className="mb-3">
                Initially we've mostly focused on calculating the effectiveness of different causes, such as global
                health, poverty, animal welfare, etc. We currently have 27 causes. You can see the effectiveness
                estimates for each cause by going to the{' '}
                <Link to={CAUSES_PATH} className="impact-link">
                  Causes
                </Link>{' '}
                page and then clicking on the cause you're interested in. The site also supports specifying the
                effectiveness of specific charities. We've only done that for a handful so far, but plan to add more in
                the future.
              </p>
              <p>
                Because we have very few staff, we've initially made heavy use of large language models to help us with
                the estimation process. We encourage the LLMs to make use of existing work by organizations such as{' '}
                <a href="https://www.givewell.org/" className="impact-link" target="_blank" rel="noopener noreferrer">
                  GiveWell
                </a>{' '}
                and{' '}
                <a
                  href="https://www.openphilanthropy.org/"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Philanthropy
                </a>
                , who have already done a lot of the hard work of estimating charity effectiveness. We plan to improve
                our estimates over time with human experts.
              </p>
            </FAQCard>

            <FAQCard
              question="The charity effectiveness estimates seem arbitrary. Why should I trust them?"
              isOpen={isOpen(4)}
              onToggle={() => toggleItem(4)}
            >
              <p className="mb-3">
                Our goal is to make the assumptions and the details of the calculations as transparent as possible. We
                encourage you to read the justifications for the effectiveness estimates for each cause, and see if they
                seem reasonable to you. If not, you have a few options:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>
                  <strong>Edit the assumptions yourself:</strong> Use the{' '}
                  <Link to="/assumptions" className="impact-link">
                    Assumptions
                  </Link>{' '}
                  page. This gives you full control over the assumptions to see how your preferred values would affect
                  the rankings. You can save your assumptions and share them with others via a custom URL.
                </li>
                <li>
                  <strong>Help us improve the estimates:</strong> For quick feedback use{' '}
                  <a
                    href="https://forms.gle/NEC6LNics3n6WVo47"
                    className="impact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    this form
                  </a>
                  {'. '}
                  Or join our{' '}
                  <a
                    href="https://discord.gg/6GNre8U2ta"
                    className="impact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>{' '}
                  and let us know why you disagree. You can also suggest changes to our research more directly by making
                  a{' '}
                  <a
                    href="https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md"
                    className="impact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub pull request
                  </a>
                  .
                </li>
              </ol>
            </FAQCard>

            <FAQCard
              question="How does it make sense to estimate the lives saved of a charity that doesn't try to save lives?"
              isOpen={isOpen(5)}
              onToggle={() => toggleItem(5)}
            >
              <p className="mb-3">
                We use the concept of a{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Quality-adjusted_life_year"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  quality adjusted life year (QALY)
                </a>{' '}
                to estimate the lives saved of a donation. One QALY represents the value of a life year lived in good
                health. To compare different cause areas, we need to convert the effects of charities into QALYs.
              </p>
              <p className="mb-3">
                For instance, if a charity cures someone's blindness we would need to estimate how much better their
                life is per year now that they can see, as a fraction of a life year. We might estimate that a year of
                not being able to see is 15% less good than a year of being able to see. So curing someone's blindness
                for a year is equivalent to 0.15 QALYs. We would then multiply this by the amount of years we expect
                them to be able to see for. If we expect them to be able to see for 10 years, then we would estimate
                that curing their blindness is equivalent to 1.5 QALYs.
              </p>
              <p>
                This process inherently involves approximations and a lot of uncertainty, but we think it's better than
                not trying to compare different charitable causes at all.
              </p>
            </FAQCard>

            <FAQCard
              question="Some donations are showing as resulting in negative lives saved. Why is that?"
              isOpen={isOpen(6)}
              onToggle={() => toggleItem(6)}
            >
              <p className="mb-3">
                This represents a case where the organization in question is actually making the world worse (usually
                despite good intentions). For instance in our view some organizations that were created with the goal of
                reducing existential risk from AI have actually ended up increasing it.
              </p>
              <p>
                A cost per life of -$5,000 means that every $5,000 donated is expected on average to harm the world as
                much as one person dying. (Which is the opposite of what positive cost per life values represent.) This
                means that the worst organizations have negative cost per life values very close to zero, similar to how
                the best organizations have positive cost per life values very close to zero.
              </p>
            </FAQCard>

            <FAQCard
              question="How do I edit the assumptions that are used to calculate the impact rankings?"
              isOpen={isOpen(7)}
              onToggle={() => toggleItem(7)}
            >
              <p className="mb-4">
                The{' '}
                <Link to="/assumptions" className="impact-link">
                  Assumptions
                </Link>{' '}
                page allows you to adjust three types of assumptions. Each has its own tab in the editor:
              </p>

              <div className="space-y-4 ml-2">
                <div>
                  <p className="font-semibold">Global Parameters</p>
                  <p>
                    Assumptions about the world as a whole that affect calculations for many charitable causes. Examples
                    include the population growth rate and the discount rate (how much less valuable future life-years
                    are compared to present life-years).
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Causes</p>
                  <p>
                    Each cause refers to a type of charitable activity. For instance "Global Health" refers to donations
                    to charities that aim to improve the health of the global population. When you edit a cause, you'll
                    see one or more effects describing different ways organizations in that cause impact the world. Most
                    causes have only one effect, but complex causes like "AGI Development" have multiple effects (e.g.,
                    productivity gains and catastrophic risk).
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Recipients</p>
                  <p className="mb-2">
                    Each recipient is an organization/charity that receives donations. A recipient can be associated
                    with one or more causes. When editing a recipient, you'll see effects for every cause they're
                    associated with. By default, each recipient inherits the assumptions of its causes unless you
                    override them.
                  </p>
                </div>
              </div>

              <p className="mt-4">
                Each parameter has a tooltip next to its name in the editor that describes what it does.
              </p>
            </FAQCard>

            <FAQCard
              question="What types of effect can each cause or recipient have?"
              isOpen={isOpen(8)}
              onToggle={() => toggleItem(8)}
            >
              <p className="mb-4">There are currently two types of effects: "standard" and "population".</p>

              <div className="space-y-4 ml-2">
                <div>
                  <p className="font-semibold">Standard Effects</p>
                  <p className="mb-2">
                    The most intuitive type. The more money you spend, the more impact you get. For example, a charity
                    providing mosquito nets can buy more nets with more donations, creating a direct relationship
                    between funding and impact.
                  </p>
                  <p className="mb-1">
                    <strong>Parameters:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    <li>
                      <strong>Cost per QALY:</strong> The wellbeing produced per dollar donated (see QALY explanation
                      above)
                    </li>
                    <li>
                      <strong>Start time:</strong> Years after donation before the effect begins
                    </li>
                    <li>
                      <strong>Duration:</strong> How many years the effect lasts (benefits assumed evenly distributed)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Population Effects</p>
                  <p className="mb-2">
                    Effects with a small probability of occurring, but that affect a large fraction of the population if
                    they do. For example, a pandemic that kills 10% of the population has a small probability of
                    happening, but would affect billions of people.
                  </p>
                  <p className="mb-1">
                    <strong>Parameters:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    <li>
                      <strong>Cost per microprobability:</strong> How much donations change the likelihood of an event
                      (a microprobability = 1 in 1,000,000 chance)
                    </li>
                    <li>
                      <strong>Population fraction affected:</strong> What fraction of the population is impacted if the
                      event occurs
                    </li>
                    <li>
                      <strong>QALY improvement per year:</strong> QALYs gained or lost per person per year if the event
                      happens
                    </li>
                    <li>
                      <strong>Start time / Duration:</strong> Same meaning as for the standard effects
                    </li>
                  </ul>
                </div>
              </div>
            </FAQCard>

            <FAQCard question="How can I get involved?" isOpen={isOpen(9)} onToggle={() => toggleItem(9)}>
              <p className="mb-3">We're actively seeking volunteers to help with the project in several areas:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>Researching the effectiveness of specific charities and of general types of charities</li>
                <li>Maintaining the list of donations that individuals on Impact List have made</li>
                <li>Adding new donors (and all their donations)</li>
                <li>Improving the functionality and UI of the site</li>
              </ul>
              <p>
                If you think you can help in other ways not mentioned here, please reach out. Join our{' '}
                <a
                  href="https://discord.gg/6GNre8U2ta"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>{' '}
                and check out our{' '}
                <a
                  href="https://github.com/impactlist/impactlist"
                  className="impact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
                .
              </p>
            </FAQCard>

            <FAQCard question="How can I stay updated?" isOpen={isOpen(10)} onToggle={() => toggleItem(10)}>
              <p>
                Keep up with the latest developments by following us on{' '}
                <a href="https://x.com/impactlist_" className="impact-link" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                . We haven't posted much yet because we haven't officially launched, but once we do this will be the
                primary way we post updates.
              </p>
            </FAQCard>

            <FAQCard question="How can I contact you?" isOpen={isOpen(11)} onToggle={() => toggleItem(11)}>
              <p>Email elliotolds at {`[Google's email service]`} with any questions.</p>
            </FAQCard>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FAQ;
