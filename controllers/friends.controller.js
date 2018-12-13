const axios = require('axios');
const config = require('../config');

async function getFriends(req, res) {
  try {
    const { data } = await axios.get(`${config.vk.PREFIX}friends.get?fields=nickname,sex,photo_50,online&user_id=${req.user.vk_id}&count=${config.pageSettings.friendsPerPage}&offset=${(req.query.page - 1) * config.pageSettings.friendsPerPage}&access_token=${req.user.token}&v=${config.vk.V}`);
    res.json({
      friends: data.response.items,
    });
  } catch (err) {
    res.status(404).end();
  }
}


module.exports = {
  getFriends,

};
