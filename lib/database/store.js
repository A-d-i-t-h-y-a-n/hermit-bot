const config = require('../../config');
const { DataTypes } = require('sequelize');

const StoreDB = config.DATABASE.define('Store', {
    storeid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    store: {
        type: DataTypes.JSON,
        allowNull: false
    }
});


async function getstore(storeid) {
return await StoreDB.findAll({where: {storeid: storeid}});
}

async function storeWriteToDB(store, storeid) {
var Msg = await StoreDB.findAll({
where: {
storeid: storeid
}
});

if (Msg.length < 1) {
return await StoreDB.create({ storeid: storeid, store: store });
} else {
return await Msg[0].update({ store: store });
}
}

module.exports = {
    StoreDB,
    getstore,
    storeWriteToDB
};