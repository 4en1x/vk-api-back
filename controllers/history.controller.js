const config = require('../config');
const axios = require('axios');

const db = require('../dao/dao');

async function getHistory(req, res) {
  try {
    const count = await db.saved_users.count(req.user.vk_id);
    const pagesCount = Math.ceil(count / config.pageSettings.itemsPerPage);
    const history = await db.saved_users.find(req.user.vk_id, req.query.page);
    const ids = history.map(item => item.vk_id).join(',');
    const { data } = await axios.get(`${config.vk.PREFIX}users.get?fields=nickname,sex,photo_50,online&user_ids=${ids}&access_token=${req.user.token}&v=${config.vk.V}`);
    res.json({
      count: pagesCount,
      history: data.response,
    });
  } catch (err) {
    res.status(404).end();
  }
}


module.exports = {
  getHistory,
};
