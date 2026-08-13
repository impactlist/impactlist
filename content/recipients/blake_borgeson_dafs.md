---
id: blake-borgeson-dafs
name: 'Blake Borgeson Donor-Advised Funds'
categories:
  - id: ai-risk
    fraction: 0.70
  - id: global-catastrophe-resilience
    fraction: 0.20
  - id: pandemics
    fraction: 0.05
  - id: science-tech
    fraction: 0.05
---

# Notes

These donor-advised funds are modeled as 70% AI risk, 20% global-catastrophe resilience, 5% pandemics, and 5% science and technology. The recorded Fidelity Charitable and Silicon Valley Community Foundation floors were inferred from grants that went entirely to Good Forever Foundation, so this recipient uses Good Forever's documented portfolio split while retaining the DAFs as the point where Blake Borgeson's money left his control. The downstream grants are not counted again. ([Good Forever Foundation filing](https://projects.propublica.org/nonprofits/organizations/873744128/202523219349106922/full), [Fidelity Charitable filing](https://projects.propublica.org/nonprofits/organizations/110303001/202521349349310887/full), [SVCF filing](https://www.svcf.org/assets/img/media/SVCF-2023-990-PDC.pdf))

# Justification of cost per life

{{RECIPIENT_DEFAULT_JUSTIFICATION}}

{{CONTRIBUTION_NOTE}}

# Internal Notes

This donor-specific recipient follows the `startsmall-daf` and `hastings-fund` precedent: donation rows remain at the charitable vehicle under the record-money-once rule, while documented downstream grants determine the vehicle's category allocation. Both known floors went to Good Forever, so its 70/20/5/5 portfolio split is copied here. This avoids applying Fidelity's opaque `other: 1.0` mapping or SVCF's institution-wide portfolio to Borgeson's known-purpose accounts without mislabeling the later Good Forever grants as new donations.
