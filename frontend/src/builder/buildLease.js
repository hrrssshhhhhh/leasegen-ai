import floridaLeaseTemplate from "../templates/floridaLeaseTemplate";
import floridaClauses from "../clauses/floridaClauses";

const buildLease = (form, aiClauses = []) => {

  let leaseTermClause = "Lease term not specified.";

  if (form.startDate && form.endDate) {
    leaseTermClause =
      `The lease shall commence on ${form.startDate} and terminate on ${form.endDate}.`;
  } else if (form.leaseTerm) {
    leaseTermClause =
      `The lease shall continue for a period of ${form.leaseTerm} months.`;
  }

  let lease = floridaLeaseTemplate
    .replace("{{landlord}}", form.landlord || "Landlord")
    .replace("{{tenant}}", form.tenant || "Tenant")
    .replace("{{address}}", form.address || "Property Address")
    .replace("{{rent}}", form.rent || "$0")
    .replace("{{deposit}}", form.deposit || "$0")
    .replace("{{state}}", form.state || "Florida")
    .replace("{{lease_term}}", leaseTermClause);

  // Build optional clause toggles
  let clauses = "";
  Object.keys(floridaClauses).forEach((key) => {
    if (form[key]) {
      clauses += "\n\n\n" + floridaClauses[key].trim();
    }
  });
  lease = lease.replace("{{optional_clauses}}", clauses);

  // Inject AI-enhanced clauses (array of { title, body })
  if (aiClauses.length > 0) {
    const aiSection = aiClauses
      .map(c => `${c.title}\n${c.body.replace(/^"|"$/g, "").trim()}`)
      .join("\n\n");
    lease = lease.replace("{{additional_clauses}}", aiSection);
  } else {
    lease = lease.replace("{{additional_clauses}}", "");
  }

  return lease;
};

export default buildLease;