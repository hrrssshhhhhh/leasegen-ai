import floridaLeaseTemplate from "../templates/floridaLeaseTemplate";
import floridaClauses from "../clauses/floridaClauses";

// Builds lease preview instantly from form data
const buildLease = (form) => {

  // Build lease term clause
  let leaseTermClause = "Lease term not specified.";

  if (form.startDate && form.endDate) {
    leaseTermClause =
      `The lease shall commence on ${form.startDate} and terminate on ${form.endDate}.`;
  } 
  else if (form.leaseTerm) {
    leaseTermClause =
      `The lease shall continue for a period of ${form.leaseTerm} months.`;
  }

  // Replace base template placeholders
  let lease = floridaLeaseTemplate
    .replace("{{landlord}}", form.landlord || "Landlord")
    .replace("{{tenant}}", form.tenant || "Tenant")
    .replace("{{address}}", form.address || "Property Address")
    .replace("{{rent}}", form.rent || "$0")
    .replace("{{deposit}}", form.deposit || "$0")
    .replace("{{state}}", form.state || "Florida")
    .replace("{{lease_term}}", leaseTermClause);

  // Build optional clauses dynamically
  let clauses = "";

  Object.keys(floridaClauses).forEach((key) => {
    if (form[key]) {
      clauses += "\n\n\n" + floridaClauses[key].trim();
    }
  });

  // Inject optional clauses into template
  lease = lease.replace("{{optional_clauses}}", clauses);

  return lease;
};

export default buildLease;