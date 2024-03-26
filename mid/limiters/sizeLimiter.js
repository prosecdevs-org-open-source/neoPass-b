/** maxSize values
 * 1b = 1
 * 1kb = 1024
 * 1mb = 1024 * 1024
 * 1gb = 1024 * 1024 * 1024
 */
const size = (maxSize) => {

  const limit = async (req, res, next) => {
    try {
      const contentLength = req.headers['content-length'];
      if (parseInt(contentLength) > maxSize) {
        return res.status(413).send(`Size of the content is larger than ${maxSize} `);
      }
      next();
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  };
  return { limit };
};

module.exports = size;
