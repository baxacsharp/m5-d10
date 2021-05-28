import express from "express";
// import { Transform } from "json2csv";
import createError from "http-errors";
// import { pipeline } from "stream";
import uniqid from "uniqid";
import multer from "multer";
import { writeBlogCovers, getMedia, writeMedia } from "../helper/helper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const media = await getMedia();
  res.send(media);
});
// router.get("/:id/createCsv", (req, res, next) => {
//   try {
//     const field = ["name", " surname", "email"];
//     const options = { field };
//     const json2csv = new Transform(options);
//     res.setHeader("Content-Disposition", `attachment; filename=export.csv`);

//     const source = getReadStreamCsv();
//     // console.log(getReadStreamCsv());
//     // console.log(source);
//     pipeline(source, json2csv, res, (err) => {
//       console.log(err);
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:id", async (req, res) => {
  const medias = await getMedia();

  const media = medias.find((media) => media.imdbID === req.params.id);

  media
    ? res.send(media)
    : res.send("media does not exist, check your media ID");
});

router.post("/", async (req, res, next) => {
  try {
    const media = { ...req.body, imdbID: uniqid(), createdOn: new Date() };
    const medias = await getMedia();
    medias.push(media);

    await writeMedia(medias);

    res.send(media);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const medias = await getMedia();
  const newMediasArray = medias.filter(
    (media) => media.imdbID !== req.params.id
  );
  const media = medias.find((media) => media.imdbID === req.params.id);

  if (!media) {
    next(createError(400, "id does not match"));
  }

  const updatedMedia = {
    ...req.body,
    createdOn: media.createdOn,
    imdbID: media.imdbID,
    lastUpdatedOn: new Date(),
  };
  newMediasArray.push(updatedMedia);

  await writeMedia(newMediasArray);

  res.send(updatedMedia);
});

router.delete("/:id", async (req, res) => {
  const medias = await getMedia();
  const newMediasArray = medias.filter(
    (media) => media.imdbID !== req.params.id
  );

  await writeMedia(newMediasArray);

  res.send("Author deleted successfully");
});

router.post(
  "/:id/poster",
  multer().single("poster"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      const medias = await getMedia();

      let media = medias.find((media) => media.imdbID === req.params.id);
      if (!media) {
        next(createError(400, "id does not match"));
      }

      await writeBlogCovers(req.params.id + ".jpg", req.file.buffer);

      media.Poster = `http://localhost:3001/image/poster${req.params.id}.jpg`;

      const newMedia = medias.filter((media) => media.imdbID !== req.params.id);
      newMedia.push(media);
      await writeMedia(newMedia);

      res.status(200).send("Image uploaded successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
