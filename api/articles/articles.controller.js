const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
    async create(req, res, next) {
        try {
            console.log("Request object:", req.body);

            if (!req.user || !req.user._id) {
                console.log("User is not authenticated or user ID is missing");
                throw new UnauthorizedError("User not authenticated");
            }

            console.log("Authenticated user ID:", req.user._id);

            const userId = req.user._id;
            if (typeof userId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(userId)) {
                throw new Error("Invalid user ID format");
            }
            const articleData = {
                ...req.body,
                user: userId
            };

            console.log("Article data to be created:", articleData);
            const article = await articlesService.create(articleData);

            console.log("Article created for Create article:", article);
            if (req.io) {
                console.log("Emitting 'article:create' event with article data");
                req.io.emit("article:create", article);
            }
            res.status(201).json(article);
        } catch (err) {
            console.error("Error occurred in create:", err);
            next(err);
        }
    }


    async update(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                console.log("Unauthorized update attempt by user:", req.user);
                throw new UnauthorizedError("Only admins can update articles");
            }

            const id = req.params.id;
            const data = req.body;

            console.log("Updating article with ID:", id);
            const articleModified = await articlesService.update(id, data);
            if (!articleModified) {
                throw new NotFoundError("Article not found");
            }

            if (req.io) {
                req.io.emit("article:update", articleModified);
            }
            res.json(articleModified);
        } catch (err) {
            console.error("Error occurred in update:", err);
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                console.log("Unauthorized delete attempt by user:", req.user);
                throw new UnauthorizedError("Only admins can delete articles");
            }

            const id = req.params.id;

            console.log("Deleting article with ID:", id);
            const result = await articlesService.delete(id);
            if (result.deletedCount === 0) {
                throw new NotFoundError("Article not found");
            }

            if (req.io) {
                req.io.emit("article:delete", { id });
            }
            res.status(204).send();
        } catch (err) {
            console.error("Error occurred in delete:", err);
            next(err);
        }
    }
}

module.exports = new ArticlesController();
