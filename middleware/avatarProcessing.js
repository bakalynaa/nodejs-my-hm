const Jimp = require('jimp');

const processAvatar = async (buffer) => {
    try {
        const image = await Jimp.read(buffer);

        return await image.resize(250, 250).getBufferAsync(Jimp.MIME_JPEG);
    } catch (error) {
        throw error;
    }
};

module.exports = { processAvatar };