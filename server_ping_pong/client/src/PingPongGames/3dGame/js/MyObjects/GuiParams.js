import * as dat from 'dat.gui'
import {params} from '../Utils/Params'

export class GuiParams {
    constructor() {
        this.isExist = {}
        this.gui = new dat.GUI()
        //dat.GUI.toggleHide();
        
        this.setUp()
    }

    setUp() {
        this.gui.add(params, 'enableOrbit');
        this.gui.addColor(params, 'color');
    }


    //let pos = this.game.guiParams.getVal("psss", {x:0, y:2, z:0}, -2, 4, 0.001)
    getVal(name, dic, min = 0, max = 100, step = 1) {
        if (!name)
            return

        if (!this.isExist[name]){
            const newFolder = this.gui.addFolder(name);
            newFolder.open()
            for (let item in dic)
                newFolder.add(dic, item, min, max).step(step)
            this.isExist[name] = dic
        }
        return (this.isExist[name])
    }
}