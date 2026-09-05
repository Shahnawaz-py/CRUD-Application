const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const token = authHeader.split(" ")[1]

    try {

        const decoded = jwt.verify(
            token,
            "mysecretkey"
        )

        req.user = decoded

        next()

    } catch (error) {

        return res.status(401).json({
            message: "Invalid Token"
        })

    }
}

module.exports = authMiddleware

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTliY2M0NWZjYjA4ZTM4M2QxOGYwZTIiLCJpYXQiOjE3ODg1OTUzMTAsImV4cCI6MTc4ODU5ODkxMH0.EisZKINiFCoaSX_Ul3OaGKD8RoDkNyw4wz4Istp1wwU