export const baseUrl = "http://localhost:4000";

window.originalFetch = window.fetch;

window.fetch = async (url, options) => {
  return window.originalFetch(`${baseUrl}${url}`, options);
};
