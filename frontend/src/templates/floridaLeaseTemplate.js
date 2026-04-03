const floridaLeaseTemplate = `
RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is made between {{landlord}} ("Landlord")
and {{tenant}} ("Tenant").

PROPERTY ADDRESS
{{address}}

RENT AGREEMENT
Monthly Rent: {{rent}}

The Tenant agrees to pay the Landlord monthly rent in the amount specified in this lease agreement.
Rent shall be due on the first day of each month and shall be paid in full without deduction or offset
unless otherwise permitted by law.

LEASE TERM
{{lease_term}}

SECURITY DEPOSIT
Deposit Amount: {{deposit}}

The Tenant shall provide a security deposit prior to occupying the premises. The deposit will be held
by the Landlord as security for the Tenant's performance of all obligations under this lease agreement.

GOVERNING LAW
This lease shall be governed by the laws of {{state}}.

{{optional_clauses}}

{{additional_clauses}}

LANDLORD SIGNATURE
________________________

TENANT SIGNATURE
________________________

DATE
________________________
`;

export default floridaLeaseTemplate;