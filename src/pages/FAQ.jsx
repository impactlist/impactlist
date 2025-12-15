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
                  How can I send some quick feedback about this site?
                </h3>
                <p className="text-gray-600">
                  Use{' '}
                  <a href="https://forms.gle/NEC6LNics3n6WVo47" className="text-blue-600 hover:text-blue-800 underline">
                    this form
                  </a>
                  {'.'}.
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
                  (1) Use the 'Edit Assumptions' button on the site header. This gives you full control over the
                  assumptions to see how your preferred values would affect the rankings.
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Some donations are showing as resulting in negative lives saved. Why is that?
                </h3>
                <p className="text-gray-600">
                  This represents a case where the organization in question is actually making the world worse (usually
                  despite good intentions). For instance in our view some organizations that were created with the goal
                  of reducing existential risk from AI have actually ended up increasing it.
                </p>
                <br />
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
                <p className="text-gray-600">
                  The 'Edit Assumptions' button in the header of the site allows you to adjust three types of
                  assumptions: global parameters, category effects, and recipient effects. Each has its own tab in the
                  editor.
                </p>
                <br />
                <p className="text-gray-600">
                  Global parameters are assumptions about the world as a whole that affect the calculations for many
                  charitable categories. For instance the population growth rate or the discount rate (how much less
                  valuable future life-years are compared to present life-years).
                </p>
                <br />
                <p className="text-gray-600">
                  Each category refers to a type of charitable activity. For instance 'Global Health' refers to
                  donations to charities that aim to improve the health of the global population. When you edit the
                  assumptions for a category, you'll see one or more effects which each describe a different way that
                  organizations in that category impact the world. Almost all categories have only one effect. The 'AGI
                  Development' category has three effects, because it's a complex category that has multiple different
                  ways that AI development can impact the world. For instance AI development has positive effects on
                  productivity similar to other technologies, but it may also increase the probability of catastrophy.
                </p>
                <br />
                <p className="text-gray-600">
                  Each recipeent is an organization/charity that recieves donations and uses them to try to have some
                  impact on the world. A recipient can be associated with one or more categories, and each category has
                  its own effects. When you edit the assumptions for a recipient, you'll see one or more effects for
                  every category they are associated with. By default each recipients inherits the assumptions of each
                  category they are associated with. You can override these defaults by setting either an override or
                  multiplier for each parameter. Overrides completely replace the default value for the category, while
                  multipliers multiply the default value for the parameter in the category.
                </p>
                <br />
                <p className="text-gray-600">
                  Each type of parameter that a category or recipient has is described by a tooltip by that paremters
                  name in the editor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What types of effect can each category or recipient have?
                </h3>
                <p className="text-gray-600">
                  There are currently only two types of effects: 'standard' and 'population'.
                </p>
                <br />
                <p className="text-gray-600">
                  Standard effects are the type of effect that is most intutive. They describe a type of impact where
                  the more money you spend on something, the more impact you get. For instance a charity that provides
                  mosquito nets can buy more nets the more money that it recieves from donors, so each donation has a
                  fairly direct impact on the world.
                </p>
                <br />
                <p className="text-gray-600">
                  The key parameter for a standard effect is 'cost per QALY' (QALYs are explained in a previous
                  question) which is an estimate of the wellbeing that is produced for every dollar donated. Standard
                  effects only have two other parameters: 'start time' and 'duration'. The start time is the number of
                  years after the donation that the effect starts, and the duration is the number of years that the
                  effect lasts. For simplicity we assume that the benefits are evenly distributed over the duration.
                </p>
                <br />
                <p className="text-gray-600">
                  Population effects are effects that we model as having some (usually small) probability of happening,
                  and then affecting a large fraction of the population if it does happen. For instance a pandemic that
                  kills 10% of the population is a population effect, because it has a small probability of happening,
                  and if it does happen it will affect a large fraction of the population.
                </p>
                <br />
                <p className="text-gray-600">
                  The key parameter associated with population effects is 'cost per microprobability' which is an
                  estimate of how much more/less likely an event is to happen for every dollar donated. A
                  microprobability represents a 1 in 1,000,000 chance of the event happening. The other parameters
                  unique to population effects are 'population fraction affected' and 'qaly improvement per year'. The
                  population fraction affected is the fraction of the population that is affected if the event happens,
                  and the qaly improvement per year is the amount of QALYs that is gained or lost per person per year if
                  the event happens. Population effects also have 'start time' and 'duration' parameters which have the
                  same interpretation as in standard effects.
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
