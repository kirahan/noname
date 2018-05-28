import cubingWS from './cubingSocket'

function cbComLive() {
    this.options = {
        enableEntry: true,
        showMessage: true,
        alertResult: true,
        alertRecord: true,
        disableChat: false
    };
    this.state = {
        onlineNumber: 0,
        user: {},
        c: 0,
        events: [],
        filters: [],
        params: {
            event: '',
            round: '',
            filter: 'all'
        },
        loading: false,
        loadingUserResults: false,
        results: [],
        userResults: [],
        messages: []
    };
    this._events = {
        onUser : {},
        onResultNew : {},
        onResultUpdate : {},
        onResultUser : {},
        onResultAll : {},
        onRoundAll : {},
        onRoundUpdate : {},
        onMessageRecent : {},
        onMessageNew : {},
    },
    this.players = {
        list : []
    }
}

cbComLive.prototype = {
    conn : function () {
        var that = this
        const cbws = new cubingWS('wss://cubingchina.com/ws')
        cbws.on("connect",function () {
            console.log("建立连接")

            cbws.send({
                type: 'competition',
                competitionId: that.state.c
            });

            cbws.send({
                type: 'result',
                action: 'rounds',
            });

            cbws.send({
                type: 'chat',
                action: 'fetch'
            });

            cbws.send({
                type: 'result',
                action: 'fetch',
                params:   {
                  event : '333',
                  round : 'f',
                  filter : 'all'
                 }
            });



        }).on('*', function(data, origin) {
            // console.log('data',data)
            // console.log('origin',origin)
        }).on('users', function(users) {
            console.log('1',users)
            that._events.onUser(users)
        }).on('result.new', function(result) {
            console.log('2',result)
            that._events.onResultNew(result)
        }).on('result.update', function(result) {
            console.log('3',result)
            that._events.onResultUpdate(result)
        }).on('result.user', function(results) {
            console.log('4',results)
            that._events.onResultUser(results)
        }).on('result.all', function(results) {
            console.log('5',results)
            that._events.onResultAll(results)
        }).on('round.all', function(rounds) {
            console.log('6',rounds)
            that._events.onRoundAll(rounds)
        }).on('round.update', function(round) {
            console.log('7',round)
            that._events.onRoundUpdate(round)
        }).on('message.recent', function(messages) {
            console.log('8',messages)
            that._events.onMessageRecent(messages)
        }).on('message.new', function(message) {
            console.log('9',message)
            that._events.onMessageNew(message)
        }).on('message.disable', function(msg) {
            console.log('10',msg)
        });
        return cbws

    },
    send : function () {
    }

}
export default cbComLive;

