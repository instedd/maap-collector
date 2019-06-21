import { Model } from 'sequelize'
class User extends Model {}

const model = (sequelize) => User.init({

}, { sequelize, modelName: model.modelName })

model.modelName = 'User'

export default model
