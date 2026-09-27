const statusForError = (error) => {
    if (Number.isInteger(error.statusCode)) return error.statusCode;
    if (error.type === "entity.parse.failed") return 400;
    if (error.code === "23505") return 409;
    if (error.code === "23503" || error.code === "23514" || error.code === "22P02") return 400;

    const message = error.message || "";
    if (/not found/i.test(message)) return 404;
    if (/already exists|already been|cannot be|only accepted|insufficient|has no items|current status/i.test(message)) return 409;
    if (/invalid|must be|cannot be negative|greater than 0|between 0 and 100/i.test(message)) return 400;
    return 500;
};

const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = statusForError(error);
    const message = status === 500
        ? "Internal server error"
        : error.message;
    if (status === 500) console.error("Unhandled request error:", error);
    return res.status(status).json({ success: false, message });
};

module.exports = { errorMiddleware };
