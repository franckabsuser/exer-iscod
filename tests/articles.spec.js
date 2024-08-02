const request = require('supertest');
const { app } = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.schema');
const mongoose = require('mongoose');

describe('API Articles Tests', () => {
    let token;
    const USER_ID = new mongoose.Types.ObjectId().toString(); // Utilisation ObjectId
    const ARTICLE_ID = new mongoose.Types.ObjectId().toString(); // Utilisation ObjectId

    const MOCK_ARTICLE = {
        _id: ARTICLE_ID,
        title: 'Test Article',
        content: 'Je suis le content article',
        user: USER_ID, // Utilisation ObjectId
        status: 'draft',
    };

    const MOCK_ARTICLE_CREATE = {
        title: 'Nouveau Test Article',
        content: 'Ceci est le nouveau test article',
        status: 'draft',
        user: USER_ID, /// Utilisation ObjectId
    };

    beforeEach(() => {
        token = jwt.sign({ _id: USER_ID, role: 'admin' }, config.secretJwtToken, { expiresIn: '1h' });

        mockingoose(Article)
            .toReturn(MOCK_ARTICLE, 'findOne')
            .toReturn(MOCK_ARTICLE, 'save')
            .toReturn(MOCK_ARTICLE_CREATE, 'save')
            .toReturn({ deletedCount: 1 }, 'deleteOne');
    });

    test('[Articles] create an article', async () => {
        const res = await request(app)
            .post('/api/articles')
            .send(MOCK_ARTICLE_CREATE)
            .set('x-access-token', token);

        expect(res.status).toBe(201);
        expect(res.body.title).toBe(MOCK_ARTICLE_CREATE.title);
    });

    test('[Articles] Update Article', async () => {
        const updateData = { title: 'Updated Title' };
        mockingoose(Article).toReturn({ ...MOCK_ARTICLE, ...updateData }, 'findOneAndUpdate');

        const res = await request(app)
            .put(`/api/articles/${ARTICLE_ID}`)
            .send(updateData)
            .set('x-access-token', token);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updateData.title);
    });

    test('[Articles] Delete Article', async () => {
        const res = await request(app)
            .delete(`/api/articles/${ARTICLE_ID}`)
            .set('x-access-token', token);

        expect(res.status).toBe(204);
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks
        mockingoose.resetAll(); // Restaurer les  mockingoose
    });
});
