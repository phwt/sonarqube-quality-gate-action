/**
 * Prefix status string with emojis
 * @param status status returned from quality gate result
 * @returns formatted status string
 */
export const getStatusEmoji = (status: string) => {
  switch (status) {
    case "OK":
      return ":white_check_mark: OK";
    case "ERROR":
      return ":exclamation:Error";
    case "WARN":
      return ":warning: Warning";
    default: // "NONE" and others
      return ":grey_question:";
  }
};

/**
 * Convert comparator into symbol
 * @param comparator comparator from quality gate result
 * @returns comparator as a symbol
 */
export const getComparatorSymbol = (comparator: string) => {
  switch (comparator) {
    case "GT":
      return ">";
    case "LT":
      return "<";
    default:
      return "";
  }
};

/**
 * Format the metric key returned from quality gate result
 * @param metricKey metric key in `snake_case` format
 * @returns formatted metric key
 */
export const formatMetricKey = (metricKey: string) => {
  const replacedString = metricKey.replace(/_/g, " ");
  return replacedString.charAt(0).toUpperCase() + replacedString.slice(1);
};
