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
      return ":exclamation: Error";
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
  const replacedString = metricKey.replaceAll(/_/g, " ");
  return replacedString.charAt(0).toUpperCase() + replacedString.slice(1);
};

export const trimTrailingSlash = (value: string) =>
  value.endsWith("/") ? value.slice(0, -1) : value;

/**
 * Format number string into number string with decimal places if the value is float
 * @param value number in string format
 * @returns formatted number string
 */
export const formatStringNumber = (value: string) => {
  const floatValue = Number.parseFloat(value);
  const isValueInteger = floatValue % 1 === 0;
  return isValueInteger ? floatValue.toFixed(0) : floatValue.toFixed(2);
};

export const getCurrentDateTime = () => {
  const currentDate = new Date();
  const offset = -(currentDate.getTimezoneOffset() / 60);
  const offsetSign = offset >= 0 ? "+" : "-";

  return {
    value: currentDate.toLocaleString(undefined, { hourCycle: "h23" }),
    offset: `UTC${offsetSign}${Math.abs(offset)}`,
  };
};
