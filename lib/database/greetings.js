const config = require('../../config');
const { DataTypes } = require('sequelize');

const GreetingsDB = config.DATABASE.define('Greeting', {
    chat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    enable: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

async function getMessage(jid = null, tip = 'welcome') {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
            type: tip
        }
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0].dataValues;
    }
}

async function setMessage(jid = null, tip = 'welcome', text = null) {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
            type: tip
        }
    });

    if (Msg.length < 1) {
        return await GreetingsDB.create({ chat: jid, type: tip, message:text, enable: true });
    } else {
        return await Msg[0].update({ chat: jid, type: tip, message:text, enable: true });
    }
}

async function enableMessage(jid = null, tip = 'welcome') {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
            type: tip
        }
    });

    if (Msg.length < 1) {
        return await GreetingsDB.create({ chat: jid, type: tip, enable: true });
    } else {
        return await Msg[0].update({ chat: jid, type: tip, enable: true });
    }
}

async function disableMessage(jid = null, tip = 'welcome') {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
            type: tip
        }
    });

    if (Msg.length < 1) {
        return await GreetingsDB.create({ chat: jid, type: tip, enable: false });
    } else {
        return await Msg[0].update({ chat: jid, type: tip, enable: false });
    }
}

async function deleteMessage(jid = null, tip = 'welcome') {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
            type: tip
        }
    });

    return await Msg[0].destroy();
}

module.exports = {
    GreetingsDB: GreetingsDB,
    getMessage: getMessage,
    setMessage: setMessage,
    enableMessage: enableMessage,
    disableMessage: disableMessage,
    deleteMessage: deleteMessage
};