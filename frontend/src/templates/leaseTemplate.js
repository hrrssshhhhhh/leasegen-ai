// Central lease template used for frontend preview
// Full lease template used for instant frontend preview
const leaseTemplate = `
RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is made between {{landlord}} ("Landlord") and {{tenant}} ("Tenant").

PROPERTY ADDRESS
{{address}}

RENT AGREEMENT
The Tenant agrees to pay the Landlord monthly rent in the amount of {{rent}}.
Rent shall be due on the first day of each month and shall be paid in full without
deduction or offset unless otherwise required by law.

SECURITY DEPOSIT
Deposit Amount: {{deposit}}

The Tenant shall provide a security deposit prior to occupying the premises.
The deposit will be held by the Landlord as security for the Tenant’s performance
of all obligations under this lease agreement.

PET POLICY
Pets shall not be permitted on the premises without prior written consent
from the Landlord. If pets are approved, the Tenant agrees to comply with
all applicable rules and may be required to pay an additional pet deposit.

MAINTENANCE
The Tenant agrees to maintain the premises in a clean and sanitary condition
and to promptly notify the Landlord of any damage or maintenance issues.
The Landlord shall be responsible for structural repairs and major maintenance
unless the damage is caused by the Tenant’s negligence.

LATE PAYMENT
If rent is not received by the due date specified in this lease agreement,
the Landlord may charge a late fee in accordance with applicable state laws.
Continued failure to pay rent may result in legal action including eviction.

TERMINATION
This lease may be terminated upon expiration of the lease term or by mutual
agreement between the Landlord and Tenant. Early termination may be permitted
under specific conditions including breach of lease terms.

UTILITIES
The Tenant shall be responsible for payment of utilities associated with
the property unless otherwise specified in this agreement. Utilities may
include electricity, water, gas, internet, and other services.

GOVERNING LAW
This lease shall be governed by the laws of {{state}}.
`;

export default leaseTemplate;