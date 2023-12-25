const express = require("express");
const path = require("path");
const {processAvatar} = require("../../middleware/avatarProcessing");
const  {upload} = require('../../middleware/uploadAvatarsOnSrorage')
const {updateContactAvatar} = require('../../controllers/UsersController')

const router = express.Router()

router.post('/avatars', upload.single('avatar'), async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const processedBuffer = await processAvatar(file.buffer);
        const avatarFileName = `${Date.now()}.jpeg`;
        const avatarPath = `/avatars/${avatarFileName}`;
        const avatarFilePath = path.join(__dirname, 'public', 'avatars', avatarFileName);

        require('fs').writeFileSync(avatarFilePath, processedBuffer);

        res.status(200).json({ avatarPath });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.patch('/users/avatars', upload.single('avatar'), async (req, res) => {
    const { file, user } = req;

    if (!file || !user) {
        return res.status(400).json({ message: 'Bad request' });
    }

    try {
        const processedBuffer = await processAvatar(file.buffer);
        const avatarFileName = `${user._id.toString()}${path.extname(file.originalname)}`;
        const avatarPath = path.join('public', 'avatars', avatarFileName);

        await require('fs').promises.writeFile(avatarPath, processedBuffer);
        const avatarURL = `/avatars/${avatarFileName}`;

        await updateContactAvatar(user._id, avatarURL);

        res.status(200).json({ avatarURL });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router

