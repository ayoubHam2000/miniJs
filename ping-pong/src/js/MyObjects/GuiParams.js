import * as dat from 'dat.gui'
import {params} from '../Utils/Params'

export class GuiParams {
    constructor() {
        this.gui = new dat.GUI()
        this.setUp()
    }

    setUp() {
        const vectorFolder = this.gui.addFolder('cameraPosition');
        vectorFolder.open()
        vectorFolder.add(params.vectorPos1, 'x', -50, 70).step(0.5).name('X')
        vectorFolder.add(params.vectorPos1, 'y', -50, 50).step(0.5).name('Y')
        vectorFolder.add(params.vectorPos1, 'z', -50, 50).step(0.5).name('Z')
        
        const cameraRotationFolder = this.gui.addFolder('cameraRotation');
        cameraRotationFolder.open()
        cameraRotationFolder.add(params.vectorRot1, 'x', -3.14, 3.14).step(0.01).name('X')
        cameraRotationFolder.add(params.vectorRot1, 'y', -3.14, 3.14).step(0.01).name('Y')
        cameraRotationFolder.add(params.vectorRot1, 'z', -3.14, 3.14).step(0.01).name('Z')

        this.gui.addColor(params, 'sphereColor')
        this.gui.add(params, 'wireFrame')
        this.gui.add(params, 'speed', 0, 1, 0.01);
        this.gui.add(params, 'penumbra', 0, 5, 0.01);
        this.gui.add(params, 'intensity', 0, 5, 0.01);
        this.gui.add(params, 'angle', 0, 1, 0.01);
    }

}