/**
 * Display metadata for the global parameters: editor labels, tooltip
 * descriptions, display format, and whether the parameter is editable.
 * Value CONSTRAINTS live in utils/globalParameterRules.js — this module only
 * describes how the parameters are presented.
 *
 * Shared by the Global tab of the assumptions editor and the
 * review-changes diff, so both always agree on names and formats.
 */
export const GLOBAL_PARAMETER_DEFINITIONS = [
  {
    id: 'discountRate',
    label: 'Discount Rate (%)',
    description:
      'Annual discount rate for future life-years. Future value is divided by 1 plus the discount rate for each year into the future. For example, at 2%, a life-year next year is worth about 98% as much as one this year; at 100%, it is worth 50% as much.',
    format: 'percentage',
  },
  {
    id: 'populationGrowthRate',
    label: 'Population Growth Rate (%)',
    description:
      'Annual population growth rate starting at the current date and continuing indefinitely or until it hits the population limit (see: Population Limit Factor). For donations in the past we use the historical growth rate until the current year.',
    format: 'percentage',
  },
  {
    id: 'populationLimit',
    label: 'Population Limit Factor',
    description:
      "The population will stop growing or shrinking when it hits this limit. The limit is expressed as a multiple of today's population. If the population growth rate would never cause the population to hit this limit, it is ignored.",
    format: 'number',
  },
  {
    id: 'timeLimit',
    label: 'Time Limit (years)',
    description:
      "Time after which we don't consider effects on the future. For instance a value of 100 means we don't consider effects on the future beyond 100 years.",
    format: 'number',
  },
  {
    id: 'currentPopulation',
    label: 'Current Population',
    description:
      'Current global population. This is the value that the Population Limit Factor is expressed in terms of.',
    format: 'number',
    readonly: true,
  },
  {
    id: 'yearsPerLife',
    label: 'Years Per Life',
    description: 'Number of years of human life that we consider equal to one life saved.',
    format: 'number',
    readonly: true,
  },
];

export const GLOBAL_PARAMETER_DEFINITIONS_BY_ID = Object.fromEntries(
  GLOBAL_PARAMETER_DEFINITIONS.map((definition) => [definition.id, definition])
);
