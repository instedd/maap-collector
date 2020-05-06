const createJSONFile = (content, filename) => {
  const blob = new Blob([JSON.stringify(content)], {
    type: 'application/json'
  });
  return new File([blob], filename);
};

export default createJSONFile;
