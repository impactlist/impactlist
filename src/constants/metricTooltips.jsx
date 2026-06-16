import React from 'react';

// Tooltip content for the "Lives Saved" and "Cost/Life" metrics. Shared between
// the list-page table headings (DonorList / RecipientList / CategoryList) and
// the summary cards at the top of the matching detail pages so both always read
// identically. Each entity type has its own phrasing.

export const DONOR_LIVES_SAVED_TOOLTIP = (
  <div>
    We first calculate the expected lives saved for each donation a person has made, based on our cost effectiveness
    estimates for every charity. We then sum these values across all the donations a person has made to get their total
    expected lives saved.
    <br />
    <br />
    See the FAQ for more details.
  </div>
);

export const DONOR_COST_PER_LIFE_TOOLTIP = (
  <div>
    Cost/Life is the amount donated divided by the lives saved. For every multiple of the dollar amount shown here, the
    equivalent of one life is expected to be saved.
  </div>
);

export const RECIPIENT_LIVES_SAVED_TOOLTIP = (
  <div>
    Expected lives saved from donations to this organization, using our effectiveness estimates from the cost/life
    column together with the total amount given.
  </div>
);

export const RECIPIENT_COST_PER_LIFE_TOOLTIP = (
  <div>
    Cost/Life comes from our cost-effectiveness estimates for this organization. It is the estimated amount one would
    need to donate to this organization to save the equivalent of one life.
  </div>
);

export const CATEGORY_LIVES_SAVED_TOOLTIP = (
  <div>
    Expected lives saved from donations to this cause, computed for each donation year and recipient/cause assumptions.
  </div>
);

export const CATEGORY_COST_PER_LIFE_TOOLTIP = (
  <div>
    Cost/Life comes from our cost-effectiveness estimates for this cause. It is the estimated donation needed to save
    the equivalent of one life in this area.
  </div>
);
