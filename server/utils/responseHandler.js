
export const sendResponse = (res, statusCode, success, message, data = null) => {
    const responseObject = { success, message };
    if (data) responseObject.data = data;
    return res.status(statusCode).json(responseObject);
};
  