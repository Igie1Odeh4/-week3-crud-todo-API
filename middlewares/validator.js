const Joi = require('joi');

const schema = Joi.object({
  task: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Task is required',
      'string.min': 'Task must be at least 3 characters',
      'string.max': 'Task must not exceed 100 characters'
    }),

  completed: Joi.boolean()
});

/* Custom middleware */
const validateTodo = (req, res, next) => {

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

module.exports = validateTodo;