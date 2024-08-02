const Article = require('./articles.schema');
const User = require('../users/users.model');
const NotFoundError = require('../../errors/not-found');

class ArticleService {
    async create(data) {
        const article = new Article(data);
        return article.save();
    }

    async update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return Article.deleteOne({ _id: id });
    }

    async getArticlesByUserId(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return Article.find({ user: userId }).populate({
            path: 'user',
            select: '-password'
        });
    }
}

module.exports = new ArticleService();
