require("../utils/database")

describe("UserService", () => {
   require('./services/UserService')
})

describe("UserController", () => {
    require('./controllers/UserController.test')
})

describe("ArticleService", () => {
    require('./services/ArticleService.test')
})

describe("ArticleController", () => {
    require('./controllers/ArticleController.test')
})