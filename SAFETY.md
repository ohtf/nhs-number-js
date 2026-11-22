# Clinical safety

This prototype is for developers checking the format, checksum and allocation range of supplied NHS-family identifiers. It does not look up patients, confirm that a number was issued, match identities or make clinical recommendations. It has no network, logging or data storage code. Do not enter real patient identifiers in tests, examples, issues or pull requests.

Status: not approved for live patient workflows. The project maintainer is responsible for commissioning an independent review; an integrating organisation is responsible for its own clinical safety and patient-matching controls.

| Hazard | Mitigation | Evidence |
| --- | --- | --- |
| A valid checksum is mistaken for a verified identifier, risking a wrong-patient match. | Treat validation as an input check only. Confirm identity through the approved workflow. A required region is not proof of allocation. | [Validation contract](spec/standard.md), [conformance fixture](tests/conformance/README.md) |
| A valid CHI number is rejected or an invalid CHI date passes, delaying a lookup or encouraging an incorrect correction. | Check the calendar date and allow both CHI checksum algorithms by default. Keep the option to disable Modulus 10 explicit. | [Public Health Scotland guidance](https://code.publichealthscotland.scot/phsmethods/articles/chi-operations.html), [conformance fixture](tests/conformance/README.md) |

## Medical-device applicability

- Initial assessment drafted 22 November 2026. Decision-maker: project maintainer, pending sign-off. Decision date: not yet recorded. Review: before any live-use recommendation.
- Evidence accessed 22 November 2026: [MHRA borderline guidance](https://www.gov.uk/guidance/borderline-products-how-to-tell-if-your-product-is-a-medical-device), [MHRA UK medical-device guidance](https://www.gov.uk/guidance/regulating-medical-devices-in-the-uk), [NHS England DCB0129/DCB0160 applicability guidance](https://digital.nhs.uk/services/clinical-safety/applicability-of-dcb-0129-and-dcb-0160/step-by-step-guidance) and the [validation contract](spec/standard.md).
- Preliminary conclusion: standalone format and checksum validation has no diagnostic or therapeutic purpose. This is not a regulatory determination, and does not establish whether the host system falls under medical-device or NHS clinical safety obligations.
- Maintainer action: confirm and record the assessment with the responsible organisation before recommending live use. Reassess if the intended purpose, clinical claims, supported populations, outputs, deployment setting, market or device integration changes.
