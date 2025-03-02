import Admin from "../src/admin/admin.model.js";

export const findAdmin = async(id) => {
    try {
        const userExist = await Admin.findById(id)
        if (!userExist ) return false
        return userExist
    } catch (err) {
        console.error(err)
        return err
    }
}

