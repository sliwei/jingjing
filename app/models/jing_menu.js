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
      title: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      is_del: {
        type: DataTypes.INTEGER(1),
        allowNull: true
      }
    },
    {
      tableName: 'jing_book'
    }
  )
}
