const User = require("./users.model");
const bcrypt = require("bcrypt");

class UserService {
  getAll() {
    return User.find({}, "-password");
  }

  get(id) {
    return User.findById(id, "-password");
  }

  async create(data) {
    const user = new User(data);
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    return user.save();
  }

  update(id, data) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return User.deleteOne({ _id: id });
  }
  async checkPasswordUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return false;
    }
    const bool = await bcrypt.compare(password, user.password);
    if (!bool) {
      return false;
    }
    return user._id;
  }
}

module.exports = new UserService();
