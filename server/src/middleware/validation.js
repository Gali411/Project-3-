import Joi from 'joi';

const validateInput = (schema, input) => {
  const { error } = schema.validate(input);
  if (error) throw new Error(error.details[0].message);
};

export default validateInput;
