const { check, validationResult } = require("express-validator");
const validateMovie = [
	check("title")
		.notEmpty()
		.withMessage("This field is required")
		.isLength({ max: 255 })
		.withMessage("Should contain less than 255 characters"),
	check("director").notEmpty().withMessage("This field is required"),
	check("year")
		.notEmpty()
		.withMessage("This field is required")
		.isInt()
		.withMessage("Should be an integer"),
	check("color")
		.notEmpty()
		.withMessage("This field is required")
		.isBoolean()
		.withMessage("Should be a boolean"),
	check("duration")
		.notEmpty()
		.withMessage("This field is required")
		.isInt()
		.withMessage("Should be an integer"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ validationErrors: errors.array() });
		}
		next();
	},
];
module.exports = validateMovie;