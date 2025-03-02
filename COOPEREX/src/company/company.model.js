import { model, Schema } from "mongoose";


const companySchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true
        },
        address: {
            type: String,
            required: [true, 'address is required'],
        },
        phone: {
            type: String,
            minLength: [8, `Can't be overcome 16 characters`],
            maxLength: [15, 'Phone must be 15 numbers'],
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        impactLevel: {
            type: String,
            required: [true, 'Impact Level is required'],
            enum: ['BAJO','MEDIO','ALTO','NINGUNO'],
            default: 'NINGUNA'
        },
        yearsOfExperience: {
            type: Number,
            required: [true, 'Years Of Experience is required'],
        },
        businessCategory: {
            type: String,
            required: [true, 'Business Category is required'],
        }
    }
)



export default model('Company', companySchema)