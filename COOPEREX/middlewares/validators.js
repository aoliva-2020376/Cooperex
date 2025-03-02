

export const createCompany = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('address','Address cannot be empty')
        .notEmpty(),
    body('phone','Phone cannot be empty')
]