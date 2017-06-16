"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');
useEmulator= true

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// Create bot and default message handler
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("選擇你/妳需要的保單規劃");
//     var msg = new builder.Message(session)
//         .attachmentLayout(builder.AttachmentLayout.carousel)
//         .attachments([
//             new builder.HeroCard(session)
//                 .title("新生兒保單")
//                 .subtitle("這份新生兒保單計劃包含了雙實支實付、完整的意外險組合、高額的單筆癌症險給付與殘廢扶助金。在合理的預算內可以給予0~12歲的小朋友足夠的基本醫療保障。另外提醒：父母親的壽險保障也是很重要的一環，在進行新生兒保單規劃時也務必要一併投保。")
//                 .images([
//                     builder.CardImage.create(session, "https://paperme.tw/images/template_2/switch.jpg")
//                         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
//                 ])
//                 .buttons([
//                     builder.CardAction.postBack(session, "select:100", "Select")
//                 ]),]);
//     builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
// });

bot.dialog('/',  [
    function (session) {
        session.send('歡迎使用Minip來快速規劃保單');
        session.beginDialog('/selectType');
    }
]);

bot.dialog('/selectType', [
    function (session, args) {
        // Remember the ID of the user and status report
        //session.dialogData.userId = args.userId;
        //session.dialogData.reportId = args.reportId;
        // Ask user their status
       var msg = new builder.Message(session)
            .attachments([
                new builder.HeroCard(session)
                    .title("想要查詢的險種")
                    .subtitle("")
                    .buttons([ 
                        builder.CardAction.dialogAction(session, 'proposal', '新生兒保單', '新生兒保單'),
                        builder.CardAction.dialogAction(session, 'proposal', '雙實支實付', '雙實支實付'),
                        builder.CardAction.dialogAction(session, 'proposal', '重大疾病', '重大疾病'),
                        builder.CardAction.dialogAction(session, 'proposal', '殘扶金', '殘扶金')
                    ])
            ]);
        session.send(msg);
    },
]);

bot.beginDialogAction('proposal', '/proposal', {
    onSelectAction: (session, args, next)=> {
        console.log("onSelectAction");
    }

});

bot.dialog('/proposal', [
    function(session, args) {
        session.clearDialogStack();
        console.log(args);
        session.send(args.data);
    }
])


// 輸入被保人名稱
// 年紀
// 性別
// 保單規劃
// 方案


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
