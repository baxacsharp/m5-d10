import express from "express";
// import { sendEmail } from "../helpers/email.js";
// import fs from "fs"
import uniqid from "uniqid";
import createError from "http-errors";
import { postValidation } from "./validation.js";
import { validationResult } from "express-validator";
// import multer from "multer";
// import fs from "fs-extra";
import { getReviews, writeReviews } from "../helper/helper.js";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { pipeline } from "stream";
// import { generatePDFStream } from "../helpers/upload.js";

// const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    if (req.query.title) {
      const filteredreviews = reviews.filter((review) =>
        review.title.toLowerCase().includes(req.query.title.toLowerCase())
      );

      filteredreviews.length > 0
        ? res.status(200).send(filteredreviews)
        : next(createError(404, `No reviews with title: ${req.query.title}`));
    } else {
      reviews.length > 0
        ? res.send(reviews)
        : next(createError(404, "No reviews available!"));
    }
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});
// router.get("/:id/pdfDownload", async (req, res, next) => {
//   try {
//     await generatePDFStream();
//     res.send("generated");
//     // const destination = res;
//     // res.setHeader("Content-Disposition", "attachment; filename=export.pdf"); // The way to acces the file in your laptop
//     //the way to connect source to destination
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:id", postValidation, async (req, res) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((review) => review._id === req.params.id);
    review
      ? res.status(200).send(review)
      : next(
          createError(
            404,
            "Blog review not found, check your ID and try again!"
          )
        );
  } catch (error) {
    next(error);
  }
});

router.post("/", postValidation, async (req, res, next) => {
  try {
    const reviews = await getReviews();
    // const response = await sendEmail("Umidjanubaydullayev@gmail.com");
    // console.log(response);
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const review = { ...req.body, _id: uniqid(), createdOn: new Date() };
      reviews.push(review);
      await writeReviews(reviews);
      res.status(201).send(review);
    } else {
      next(createError(400, errors));
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", postValidation, async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(createError(400, errors));
    } else {
      //   const review = reviews.find((review) => review._id === req.params.id);
      const filtered = reviews.filter((review) => review._id !== req.params.id);
      const updatedreview = {
        ...req.body,
        createdOn: filtered.createdOn,
        _id: filtered._id,
        lastUpdatedOn: new Date(),
      };
      filtered.push(updatedreview);
      await writeReviews(filtered);
      res.status(200).send(updatedreview);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const newReviewsArray = reviews.filter(
      (review) => review._id !== req.params.id
    );
    await writeReviews(newReviewsArray);

    res.send(newReviewsArray);
  } catch (error) {
    next(error);
  }
});

// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "blogCovers",
//     resource_type: "auto",
//   },
// });

// const upload = multer({
//   storage: cloudinaryStorage,
// }).single("blogCover");

// router.post("/:id/uploadCover", upload, async (req, res, next) => {
//   try {
//     console.log(req.file);
//     const blogs = await getBlogPosts();

//     let blog = blogs.find((blog) => blog._id === req.params.id);
//     if (!blog) {
//       next(createError(400, "id does not match"));
//     }

//     blog.cover = req.file.path;

//     const newBlogs = blogs.filter((blog) => blog._id !== req.params.id);
//     newBlogs.push(blog);
//     await writeBlogs(newBlogs);

//     res.status(200).send("Image uploaded successfully");
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/blogposts/:id/comments", async (req, res, next) => {});

// router.post("/blogposts/:id/comments", async (req, res, next) => {});

export default router;
