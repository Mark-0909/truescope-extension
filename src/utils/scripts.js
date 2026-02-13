export const mapVerdictToLabel = (verdict) => {
  if (verdict > 0.33) return "true";
  if (verdict < -0.33) return "fake";
  return "neutral";
};

export const verdictToTruthScore = (verdict) => {
  return Math.round(((verdict + 1) / 2) * 100);
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSource = (rawSource) => {
  switch (rawSource) {
    case "FACTCHECKORG":
      return "FactCheck.org";
    case "FRONTPAGEPH":
      return "FrontpagePH";
    case "FULLFACT":
      return "Full Fact";
    case "GMANETWORK":
      return "GMA Network";
    case "MANILA-BULLETIN":
      return "Manila Bulletin";
    case "MANILASTANDARD":
      return "Manila Standard";
    case "PHILIPPINE-NEWS-AGENCY":
      return "PNA";
    case "VERAFILES":
      return "VERA Files";
    default:
      if (typeof rawSource === "string" && rawSource.length > 0) {
        return (
          rawSource.charAt(0).toUpperCase() + rawSource.slice(1).toLowerCase()
        );
      }
      return rawSource;
  }
};
