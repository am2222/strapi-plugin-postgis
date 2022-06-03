export const toTitleCase = (txt) => {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
};


export const capitlizeFirst = (str) => {
  // checks for null, undefined and empty string
  if (!str) return;
  return str.match("^[a-z]") ? str.charAt(0).toUpperCase() + str.substring(1) : str;
}