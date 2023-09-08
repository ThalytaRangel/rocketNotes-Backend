const knex = require("../database/knex");
const AppError = require('../utils/AppError');
const DiskStorage = require("../providers/DiskStorage");


class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFileName = request.file.filename;

    const diskstorage = new DiskStorage();

    const user = await knex("users").where({id: user_id}).first();

    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar")
    }

    if (user.avatar) {
      await diskstorage.deleteFile(user.avatar);
    }

    const filename = await diskstorage.saveFile(avatarFileName);

    user.avatar = filename;

    await knex("users").update(user).where({id: user.id});

    return response.json(user);
  }
}

module.exports = UserAvatarController;