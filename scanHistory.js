const router = require('express').Router();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { ObjectId } = require('mongodb');
const { database } = require('./databaseConnection');


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

const userCollection = database.db(process.env.MONGODB_DATABASE).collection('users');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const mongoSanitize = require('express-mongo-sanitize');

router.use(mongoSanitize(
    { replaceWith: '%' }
));

router.post('/picUpload', upload.single('image'), async (req, res) => {
    try {
        // get username from the session
        const username = req.session.username;
        if (!username) {
            return res.status(400).send('Username is required.');
        }

        // Upload image to Cloudinary
        cloudinary.uploader.upload("data:image/png;base64," + req.file.buffer.toString('base64'), async function (error, result) {
            if (error) {
                console.error(error);
                return res.status(500).send('Error uploading image to Cloudinary.');
            }

            console.log('Cloudinary upload result:', result);

            // Prepare scan history entry
            const scanEntry = {
                scanId: new ObjectId(),
                timestamp: new Date(),
                scanData: result.secure_url
            };

            // Update user's scan history in MongoDB
            const updateResult = await userCollection.updateOne(
                { username: username },
                { $push: { scanHistory: scanEntry } }
            );

            if (updateResult.modifiedCount === 1) {
                console.log('Scan history updated successfully.');
                res.send('Scan history updated successfully.');
            } else {
                console.log('User not found or scan history update failed.');
                res.status(404).send('User not found or scan history update failed.');
            }
        });
    } catch (error) {
        console.error('Error uploading image or updating scan history:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
