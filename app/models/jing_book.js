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
      }, // int(11) NOT NULL AUTO_INCREMENT,
      menu_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }, // int(11) DEFAULT NULL,
      title: {
        type: DataTypes.CHAR(255),
        allowNull: true
      }, // varchar(255) DEFAULT NULL,
      note: {
        type: DataTypes.CHAR(255),
        allowNull: true
      }, // varchar(255) DEFAULT NULL,
      url: {
        type: DataTypes.CHAR(255),
        allowNull: true
      }, // varchar(255) DEFAULT NULL,
      headimg: {
        type: DataTypes.CHAR(255),
        allowNull: true
      }, // varchar(255) DEFAULT NULL,
      createtime: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return moment(this.getDataValue('create_time')).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
      }, // datetime DEFAULT NULL,
      is_del: {
        type: DataTypes.INTEGER(1),
        allowNull: true
      }, // int(1) unsigned zerofill DEFAULT NULL,
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      } // int(11) DEFAULT NULL,
    },
    {
      tableName: 'jing_book'
    }
  )
}
