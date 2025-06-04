const { buildHomePage } = require("../utilities");

const showHomePage = (req, res) => {
  res.send(buildHomePage());
};

module.exports = { showHomePage };
