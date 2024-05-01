export const getUrlParams = ({
  url,
  urlPattern,
  paramsToRetrieve,
}: {
  url: string;
  urlPattern: string;
  paramsToRetrieve: string[];
}) => {
  // For more details on URLPattern, check https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
  const pathPattern = new URLPattern({ pathname: urlPattern });
  const matchingPath = pathPattern.exec(url);

  if (matchingPath) {
    return paramsToRetrieve.map((param) => {
      return matchingPath.pathname.groups[param];
    });
  }
  return null;
};
