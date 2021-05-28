import { body } from "express-validator";

export const postValidation = [
  body("comment").exists().withMessage("comment is a mandatory field!"),
];
