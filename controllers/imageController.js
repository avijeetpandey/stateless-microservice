
const { body, validationResult } = require('express-validator/check');
const sharp = require('sharp');
const download = require('image-downloader');
const jsonpatch = require('fast-json-patch');
const { fileExtension } = require('../middleware/tokenMiddleware');

const imageTypes = ['jpg',  'gif', 'png'];


/**
 *  Steps
 * 1.Extract the image url from the body
 * 2.Resized Images are sotored inside the folder public/images/resized
 * 3.After the images is been resized promise is been solved
 * 4.Sucees is returned to the server
 * 5.Else error is raised and thrown
 * */

exports.create_thumbnail_post = (req, res, next) => {
    const { imageUrl } = req.body;
    const imageUrlExt = fileExtension(imageUrl).toLowerCase();
    if (imageTypes.includes(imageUrlExt)) {
        const options = {
            url: imageUrl,
            dest: './public/images/original/',
        };
        const resizeFolder = './public/images/resized/';
        download.image(options)
            .then(({ filename }) => {
                sharp(filename)
                    .resize(50, 50)
                    .toFile(`${resizeFolder}output.${imageUrlExt}`, (err) => {
                        if (err) { return next(err) }
                        return res.json({
                            converted: true, user: req.user.username, success: 'Image has been resized', thumbnail: resizeFolder,
                        });
                    });
            })
            .catch(() => {
                res.status(400).json
                ({ error: 'Oops something went wrong. Kindly check your image url and try again' });
            });
    } else {
        res.status(400).json
        ({ error: `unkown file extension - ${[...imageTypes]}` });
    }
}

// Apply json patch to json object and return patched object.
exports.patch_json_patch = [
    // Validate input fields. Trim spaces around username
    body('jsonObject', 'JSON object must not be empty.').isLength({ min: 1 }),
    body('jsonPatchObject', 'JSON patch object must not be empty.').isLength({ min: 1 }),

    // Process the request after validating.
    (req, res, next) => {
        // Save errors from validating, if any.
        const errors = validationResult(req);

        // Check if there were errors from the form.
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Save object-to-patch and patch-object from the request.
        const jsonObject = JSON.parse(req.body.jsonObject);
        const jsonPatchObject = JSON.parse(req.body.jsonPatchObject);

        // Save patch in new variable.
        const patchedObject = jsonpatch.applyPatch(jsonObject, jsonPatchObject).newDocument;
        // res.json({user: req.user.username, patchedObject: patchedObject})
        res.json({ patchedObject });
    },
]
