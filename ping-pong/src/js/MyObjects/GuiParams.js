import * as dat from 'dat.gui'
import {params} from '../Utils/Params'

export class GuiParams {
    constructor() {
        this.isExist = {}
        this.gui = new dat.GUI()

        
        this.vectorFolder = this.gui.addFolder('Values');
        this.vectorFolder.open()

        this.setUp()
    }

    setUp() {
        const vectorFolder = this.gui.addFolder('cameraPosition');
        //vectorFolder.open()
        vectorFolder.add(params.vectorPos1, 'x', -50, 70).step(0.5).name('X')
        vectorFolder.add(params.vectorPos1, 'y', -50, 50).step(0.5).name('Y')
        vectorFolder.add(params.vectorPos1, 'z', -50, 50).step(0.5).name('Z')
        
        const cameraRotationFolder = this.gui.addFolder('cameraRotation');
        //cameraRotationFolder.open()
        cameraRotationFolder.add(params.vectorRot1, 'x', -3.14, 3.14).step(0.01).name('X')
        cameraRotationFolder.add(params.vectorRot1, 'y', -3.14, 3.14).step(0.01).name('Y')
        cameraRotationFolder.add(params.vectorRot1, 'z', -3.14, 3.14).step(0.01).name('Z')

        const racketRotationFolder = this.gui.addFolder('racketRotation');
        racketRotationFolder.open()
        racketRotationFolder.add(params.racketRot, 'x', -3.14, 3.14).step(0.01).name('X')
        racketRotationFolder.add(params.racketRot, 'y', -3.14, 3.14).step(0.01).name('Y')
        racketRotationFolder.add(params.racketRot, 'z', -3.14, 3.14).step(0.01).name('Z')


        this.gui.addColor(params, 'sphereColor')
        this.gui.add(params, 'wireFrame')
        this.gui.add(params, 'speed', 0, 1, 0.01);
        this.gui.add(params, 'penumbra', 0, 1, 0.01);
        this.gui.add(params, 'intensity', 0, 5, 0.01);
        this.gui.add(params, 'angle', 0, 1.6, 0.01);
        this.gui.add(params, 'enableOrbit');

        this.gui.add(params, 'width', 0, 400);
        this.gui.add(params, 'height', 0, 400);
        this.gui.add(params, 'depth', 0, 400);
        this.gui.add(params, 'posY', -100, 100);

        this.gui.add(params, 'table_width', 0, 400);
        this.gui.add(params, 'table_height', 0, 400);
        this.gui.add(params, 'table_depth', 0, 400);
        this.gui.add(params, 'ambientLightIntensity', 0, 3, 0.01);
    }

   
    controlObj(obj, name, pos, rot, scale) {
        if (!name || !obj)
            return
            
        if (!pos)
            pos = {x: 0, y:0, z:0}
        if (!rot)
            rot = {x: 0, y:0, z:0}
        if (!scale)
            scale = {x: 1, y:1, z:1}
        if (!this.isExist[name]) {
            const folder = this.gui.addFolder(name);
            folder.open()
            folder.add(pos, 'x', -100, 100).step(0.1).name('PX')
            folder.add(pos, 'y', -100, 100).step(0.1).name('PY')
            folder.add(pos, 'z', -100, 100).step(0.1).name('PZ')
    
            folder.add(rot, 'x', -3.1415, 3.1415).step(0.01).name('RX')
            folder.add(rot, 'y', -3.1415, 3.1415).step(0.01).name('RY')
            folder.add(rot, 'z', -3.1415, 3.1415).step(0.01).name('RZ')
    
            folder.add(scale, 'x', 0, 40).step(0.01).name('SX')
            folder.add(scale, 'y', 0, 40).step(0.01).name('SY')
            folder.add(scale, 'z', 0, 5).step(0.01).name('SZ')
            this.isExist[name] = {
                pos, rot, scale
            }
        }

        obj.position.x = this.isExist[name].pos.x
        obj.position.y = this.isExist[name].pos.y
        obj.position.z = this.isExist[name].pos.z
        obj.rotation.x = this.isExist[name].rot.x
        obj.rotation.y = this.isExist[name].rot.y
        obj.rotation.z = this.isExist[name].rot.z
        obj.scale.x = this.isExist[name].scale.x
        obj.scale.y = this.isExist[name].scale.y
        obj.scale.z = this.isExist[name].scale.z
    }

    getVal(name, dic, min = 0, max = 100, step = 1) {
        if (!name)
            return

        if (!this.isExist[name]){
            for (let item in dic)
                this.vectorFolder.add(dic, item, min, max).step(step)
            this.isExist[name] = dic
        }
        return (this.isExist[name])
    }

}