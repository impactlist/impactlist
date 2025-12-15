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
                <p className="text-gray-600 mb-3">
                  Impact List is a project that aims to build and maintain a list which ranks the top ~1,000 living
                  people by their positive impact on the world via donations. We do this by building a database of
                  donations, making estimates about the effectiveness of those donations, and trying to present this
                  data in a useful way.
                </p>
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
                  How can I send some quick feedback about this site?
                </h3>
                <p className="text-gray-600">
                  Use{' '}
                  <a href="https://forms.gle/NEC6LNics3n6WVo47" className="text-blue-600 hover:text-blue-800 underline">
                    this form
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How do you calculate the effectiveness of different charities?
                </h3>
                <p className="text-gray-600 mb-3">
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
                <p className="text-gray-600 mb-3">
                  Our goal is to make the assumptions and the details of the calculations as transparent as possible. We
                  encourage you to read the justifications for the effectiveness estimates for each category, and see if
                  they seem reasonable to you. If not, you have a few options:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
                  <li>
                    <strong>Edit the assumptions yourself:</strong> Use the "Edit Assumptions" button on the site
                    header. This gives you full control over the assumptions to see how your preferred values would
                    affect the rankings.
                  </li>
                  <li>
                    <strong>Help us improve the estimates:</strong> Email us (see below) or join our{' '}
                    <a href="https://discord.gg/6GNre8U2ta" className="text-blue-600 hover:text-blue-800 underline">
                      Discord
                    </a>{' '}
                    and let us know why you disagree. You can also contribute more directly by making a{' '}
                    <a
                      href="https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub pull request
                    </a>
                    .
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How does it make sense to estimate the lives saved of a charity that doesn't try to save lives?
                </h3>
                <p className="text-gray-600 mb-3">
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
                <p className="text-gray-600 mb-3">
                  For instance, if a charity cures someone's blindness we would need to estimate how much better their
                  life is per year now that they can see, as a fraction of a life year. We might estimate that a year of
                  not being able to see is 15% less good than a year of being able to see. So curing someone's blindness
                  for a year is equivalent to 0.15 QALYs. We would then multiply this by the amount of years we expect
                  them to be able to see for. If we expect them to be able to see for 10 years, then we would estimate
                  that curing their blindness is equivalent to 1.5 QALYs.
                </p>
                <p className="text-gray-600">
                  This process inherently involves approximations and a lot of uncertainty, but we think it's better
                  than not trying to compare different charitable causes at all.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Some donations are showing as resulting in negative lives saved. Why is that?
                </h3>
                <p className="text-gray-600 mb-3">
                  This represents a case where the organization in question is actually making the world worse (usually
                  despite good intentions). For instance in our view some organizations that were created with the goal
                  of reducing existential risk from AI have actually ended up increasing it.
                </p>
                <p className="text-gray-600">
                  A cost per life of -$5,000 means that every $5,000 donated is expected on average to harm the world as
                  much as one person dying. (Which is the opposite of what positive cost per life values represent.)
                  This means that the worst organizations have negative cost per life values very close to zero, similar
                  to how the best organizations have positive cost per life values very close to zero.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How do I edit the assumptions that are used to calculate the impact rankings?
                </h3>
                <p className="text-gray-600 mb-4">
                  The "Edit Assumptions" button in the header of the site allows you to adjust three types of
                  assumptions. Each has its own tab in the editor:
                </p>

                <div className="space-y-4 ml-2">
                  <div>
                    <p className="text-gray-700 font-semibold">Global Parameters</p>
                    <p className="text-gray-600">
                      Assumptions about the world as a whole that affect calculations for many charitable categories.
                      Examples include the population growth rate and the discount rate (how much less valuable future
                      life-years are compared to present life-years).
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold">Categories</p>
                    <p className="text-gray-600">
                      Each category refers to a type of charitable activity. For instance "Global Health" refers to
                      donations to charities that aim to improve the health of the global population. When you edit a
                      category, you'll see one or more effects describing different ways organizations in that category
                      impact the world. Most categories have only one effect, but complex categories like "AGI
                      Development" have multiple effects (e.g., productivity gains and catastrophic risk).
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold">Recipients</p>
                    <p className="text-gray-600 mb-2">
                      Each recipient is an organization/charity that receives donations. A recipient can be associated
                      with one or more categories. When editing a recipient, you'll see effects for every category
                      they're associated with.
                    </p>
                    <p className="text-gray-600">
                      By default, each recipient inherits the assumptions of its categories. You can customize these
                      using:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 ml-2 mt-1">
                      <li>
                        <strong>Overrides:</strong> Completely replace the default value
                      </li>
                      <li>
                        <strong>Multipliers:</strong> Multiply the default value by a factor
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-600 mt-4">
                  Each parameter has a tooltip next to its name in the editor that describes what it does.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What types of effect can each category or recipient have?
                </h3>
                <p className="text-gray-600 mb-4">
                  There are currently two types of effects: "standard" and "population".
                </p>

                <div className="space-y-4 ml-2">
                  <div>
                    <p className="text-gray-700 font-semibold">Standard Effects</p>
                    <p className="text-gray-600 mb-2">
                      The most intuitive type. The more money you spend, the more impact you get. For example, a charity
                      providing mosquito nets can buy more nets with more donations, creating a direct relationship
                      between funding and impact.
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
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
                    <p className="text-gray-700 font-semibold">Population Effects</p>
                    <p className="text-gray-600 mb-2">
                      Effects with a small probability of occurring, but that affect a large fraction of the population
                      if they do. For example, a pandemic that kills 10% of the population has a small probability of
                      happening, but would affect billions of people.
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      <li>
                        <strong>Cost per microprobability:</strong> How much donations change the likelihood of an event
                        (a microprobability = 1 in 1,000,000 chance)
                      </li>
                      <li>
                        <strong>Population fraction affected:</strong> What fraction of the population is impacted if
                        the event occurs
                      </li>
                      <li>
                        <strong>QALY improvement per year:</strong> QALYs gained or lost per person per year if the
                        event happens
                      </li>
                      <li>
                        <strong>Start time / Duration:</strong> Same meaning as standard effects
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How can I get involved?</h3>
                <p className="text-gray-600 mb-3">
                  We're actively seeking volunteers to help with the project in several areas:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2 mb-3">
                  <li>Researching the effectiveness of different categories of donations</li>
                  <li>Evaluating the effectiveness of specific organizations</li>
                  <li>Tracking which donations individuals on the list have made</li>
                  <li>Adding new people to the list</li>
                  <li>React development for the website</li>
                </ul>
                <p className="text-gray-600">
                  If you think you can help in other ways not mentioned here, please reach out. Join our{' '}
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
