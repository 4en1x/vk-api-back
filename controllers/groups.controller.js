const axios = require('axios');
const config = require('../config');
const db = require('../dao/dao');


async function getGroups(req, res) {
  try {
    let userId = req.user.vk_id;
    if (req.query.filter) {
      userId = req.query.filter;
      await db.saved_users.add({
        user_id: req.user.vk_id,
        vk_id: req.query.filter,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
    }
    const { data: groups } = await axios.get(`${config.vk.PREFIX}groups.get?user_id=${userId}&extended=0&count=1000&access_token=${req.user.token}&v=${config.vk.V}`);
    const pagesCount = Math.ceil(groups.response.count / config.pageSettings.itemsPerPage);
    const start = (req.query.page - 1) * config.pageSettings.itemsPerPage;
    const ids = groups.response.items.slice(
      start,
      start + config.pageSettings.itemsPerPage,
    );
    const { data } = await axios.get(`${config.vk.PREFIX}groups.getById?group_ids=${ids.join(',')}&fields=description,members_count,status&user_id=${userId}&access_token=${req.user.token}&v=${config.vk.V}`);
    const newGroups = data.response.map(group => Object.assign({}, group, {
      link: `${config.vk.MAIN_PREFIX}${group.screen_name}`,
    }));
    res.json({
      count: pagesCount,
      groups: newGroups,
    });
  } catch (err) {
    res.status(404).end();
  }
}

async function getWallById(req, res) {
  try {
    let { data: posts } = await axios.get(`${config.vk.PREFIX}wall.get?owner_id=-${req.params.id}&extended=0&count=${config.pageSettings.postsPerPage}&offset=${(req.query.page - 1) * config.pageSettings.postsPerPage}&access_token=${req.user.token}&v=${config.vk.V}`);

    posts = posts.response.items;

    posts = posts.map((post) => {
      if (post.attachments) {
        post.attachments = post.attachments.filter(att => att.type === 'photo');
      } else {
        post.attachments = [];
      }
      return post;
    });

    res.json({
      posts,
    });
  } catch (err) {
    res.status(404).end();
  }
}

async function like(req, res) {
  try {
    let response;
    if (!req.body.status) {
      response = await axios.get(`${config.vk.PREFIX}likes.add?type=post&item_id=${req.params.postId}&owner_id=-${req.params.groupId}&access_token=${req.user.token}&v=${config.vk.V}`);
    } else {
      response = await axios.get(`${config.vk.PREFIX}likes.delete?type=post&item_id=${req.params.postId}&owner_id=-${req.params.groupId}&access_token=${req.user.token}&v=${config.vk.V}`);
    }
    if (!response.data.response) {
      res.status(409).send({ error: 'Too many requests' });
      return;
    }
    res.json(response.data.response);
  } catch (err) {
    res.status(404).end();
  }
}

async function subscribe(req, res) {
  try {
    const { data } = await axios.get(`${config.vk.PREFIX}groups.join?group_id=${req.body.groupId}&access_token=${req.user.token}&v=${config.vk.V}`);
    if (!data.response) {
      res.status(409).send({ error: 'Too many requests' });
      return;
    }
    res.json(data.response);
  } catch (err) {
    res.status(404).end();
  }
}

async function unsubscribe(req, res) {
  try {
    const { data } = await axios.get(`${config.vk.PREFIX}groups.leave?group_id=${req.body.groupId}&access_token=${req.user.token}&v=${config.vk.V}`);
    if (!data.response) {
      res.status(409).send({ error: 'Too many requests' });
      return;
    }
    res.json(data.response);
  } catch (err) {
    res.status(404).end();
  }
}

module.exports = {
  getGroups,
  getWallById,
  subscribe,
  unsubscribe,
  like,
};
