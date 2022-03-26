import Sequelize from 'sequelize'
import config from '../../config'

const { db } = config
const sequelize = new Sequelize(db.database, db.username, db.password, db.conf)

sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功'.green)
  })
  .catch((err) => {
    console.log('数据库连接失败'.red)
  })

export { Sequelize, sequelize }
