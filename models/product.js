import { Schema, model } from "mongoose"

const ProductSchema = new Schema({
    img: {
        type: String
    },
    name: {
        type: String
    },
    text: {
        type: String
    },
    size: {
        type: Object
    },
    color: {
        type: Array
    },
    gender: {
        type: Array
    },
    price: {
        type: Number
    },
})


// const slaiderDataSchema = new Schema({
//     id: {
//         type: String
//     },
//     img: {
//         type: String
//     },
//     text: {
//         type: String
//     }

// })

const ProductModul = model("datas", ProductSchema)

// const sliderDataModul = model("sliderData", slaiderDataSchema)

export default ProductModul ;