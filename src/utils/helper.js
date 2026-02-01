// Helper to convert stored file path into full backend URL
export const media = (filePath) => {
  if (!filePath) return "";
  return `http://localhost:5000${filePath}`;
};
