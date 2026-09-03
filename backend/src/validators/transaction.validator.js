const { z } = require("zod");

const transactionSchema = z.object({
    categoryId: z
        .number()
        .int()
        .positive(),

    amount: z
        .number()
        .positive(),

    type: z
        .enum(["income", "expense"]),

    description: z
        .string()
        .max(500)
        .optional(),

    date: z
        .string()
        .date()
});

module.exports = {
    transactionSchema
};