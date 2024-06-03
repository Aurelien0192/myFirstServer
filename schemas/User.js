let userInformation = {
    required : ["firstName","lastName","username", "email"],
    authorized: ["firstName","lastName","username", "email", "phone"],
    unique: ["userName"],
    elements :[]
}

module.exports = userInformation