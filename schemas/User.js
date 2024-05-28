let userInformation = {
    required : ["firstName","lastName","userName", "email"],
    authorized: ["firstName","lastName","userName", "email", "phone"],
    unique: ["userName"],
    elements :[]
}

module.exports = userInformation