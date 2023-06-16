const params = require('./Params')
const THREE = require('three')
const Ball = require('./Ball')
const Bot = require('./Bot')

module.exports = class Game {
    constructor() {


        this.gameInfo = {
            turn: 0, //the player that will shot the ball
            initTurn: 0,
            scorePlayer1: 0,
            scorePlayer2: 0,
            start: false,
            isBot: false
        }
    }

    init(botMode = false) {
        this.ballObj = new Ball(this)
        if (botMode)
            this.botObj = new Bot(this)
        // if (game.gameInfo.isBot) {
        //     this.player2 = new Bot(game)
        // } else {
        //     this.player2 = new Human(game)
        // }
    } 


    start(data) {
        console.log("Game is started ...")
        if (this.gameInfo.isBot)
            return
        this.gameInfo.turn = data.turn
        this.gameInfo.initTurn = data.turn
        this.gameInfo.start = true
    }

    getTurnInit() {
        //0->player1 1->player2
        let a = (this.gameInfo.initTurn) + parseInt((this.gameInfo.scorePlayer1 + this.gameInfo.scorePlayer2) / 2)
        return (a % 2)
    }

    getTurn() {
        return this.gameInfo.turn
    }

    changeTurn(to = undefined) {
        // console.trace(`=>${to} myFunction called from:`);
        if (to === undefined) {
            this.gameInfo.turn = (this.gameInfo.turn + 1) % 2
        } else {
            this.gameInfo.turn = to    
        }
    }


    update() {
        // if (!this.gameInfo.start)
        //     return
        this.ballObj.update()
        this?.botObj?.update()
        params.frame++
    }

    gameLoop() {
        this.interval = setInterval((game) => game.update(), 1000 / 60, this)
    }

    stop() {
        clearInterval(this.interval)
    }
}
    