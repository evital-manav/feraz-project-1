export const applyValidation = async (schema: any, object: any) => {
  try {
    const validate = await schema.validateAsync(object);
    console.log(validate);
    return validate;
  } catch (err) {
    console.log();
    const error = err as any;
    error.errorCode = 400;
    error.message = error.message.replace(/"/g, "");

    throw error;
  }
};
