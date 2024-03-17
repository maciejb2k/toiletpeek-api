export const isObjectEmpty = (objectName) => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};

export const decodeBase64 = (basicAuth: string) => {
  return Buffer.from(basicAuth, 'base64').toString().split(':');
};

export const extractToken = (authHeader: string) => {
  return authHeader.split(' ')[1] as string;
};
