export const toPlain = (doc) => {
    if (!doc) {
        return null;
    }

    if (typeof doc.toJSON === "function") {
        return doc.toJSON();
    }

    return doc;
};
