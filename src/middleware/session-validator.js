import axios from "axios";

const sessionValidator = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if(bearerHeader) {
            const { data } = await axios.post(`http://${process.env.MIDDLEWARE_SERVICE_URL}/api/v1/sessions/validate-session`, {
                accessToken: bearerHeader.split(" ")[1]
            });

            if(data.valid) {
                req.userId = data.userId;
                req.email = data.email;
                next();
            } else {
                return res.status(401).json({
                    valid: false,
                    type: "NotAuthorizedException",
                    message: "Invalid token."
                });
            }
        }
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            valid: false,
            type: "NotAuthorizedException",
            error: "Unknown error."
        });
    }
}

export {
    sessionValidator
}