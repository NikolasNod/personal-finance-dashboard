const { z } = require("zod");

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(100, "Category name is too long"),

    type: z
        .enum(["income", "expense"])
});

module.exports = {
    categorySchema
};