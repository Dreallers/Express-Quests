const { check, validationResult } = require("express-validator");
const validateUser = [
	check("firstname")
		.notEmpty()
		.withMessage("This field is required")
		.isLength({ max: 255 })
		.withMessage("Should contain less than 255 characters"),
    check("lastname")
		.notEmpty()
		.withMessage("This field is required")
		.isLength({ max: 255 })
		.withMessage("Should contain less than 255 characters"),
    check("city")
		.notEmpty()
		.withMessage("This field is required")
		.isLength({ max: 255 })
		.withMessage("Should contain less than 255 characters"),
    check("language")
		.notEmpty()
		.withMessage("This field is required")
		.isLength({ max: 255 })
		.withMessage("Should contain less than 255 characters"),
	check("email")
		.notEmpty()
		.withMessage("This field is required")
		.isEmail()
		.withMessage("Should be a valid email address"),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ validationErrors: errors.array() });
		}
		next();
	},
];
module.exports = validateUser;