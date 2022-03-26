import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define(
    'jing_book',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      menu_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      title: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      note: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      url: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      headimg: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      createtime: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return moment(this.getDataValue('create_time')).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
      },
      addtime: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return moment(this.getDataValue('addtime')).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
      },
      is_del: {
        type: DataTypes.INTEGER(1),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }
    },
    {
      tableName: 'jing_book'
    }
  )
}
