import * as dat from 'dat.gui'

export class GuiParams {
    constructor() {
        this.gui = new dat.GUI()

        this.sphereColor = "#00ff00",
        this.wireFrame = false,
        this.speed = 0.01,
        this.penumbra = 0,
        this.intensity = 1,
        this.angle = 0.2,
        this.x = 0;
        this.vectorPos1 = {
            x: 40,
            y: 16,
            z: 0,
        };
        this.vectorRot1 = {
            x: -Math.PI / 2,
            y: Math.PI / 2 - 0.4,
            z: Math.PI / 2,
        };

        this.setUp()
    }

    setUp() {
        const vectorFolder = this.gui.addFolder('cameraPosition');
        vectorFolder.open()
        vectorFolder.add(this.vectorPos1, 'x', -50, 70).step(0.5).name('X')
        vectorFolder.add(this.vectorPos1, 'y', -50, 50).step(0.5).name('Y')
        vectorFolder.add(this.vectorPos1, 'z', -50, 50).step(0.5).name('Z')
        
        const cameraRotationFolder = this.gui.addFolder('cameraRotation');
        vectorFolder.open()
        vectorFolder.add(this.vectorRot1, 'x', -3.14, 3.14).step(0.01).name('X')
        vectorFolder.add(this.vectorRot1, 'y', -3.14, 3.14).step(0.01).name('Y')
        vectorFolder.add(this.vectorRot1, 'z', -3.14, 3.14).step(0.01).name('Z')

        this.gui.addColor(this, 'sphereColor')
        this.gui.add(this, 'wireFrame')
        this.gui.add(this, 'speed', 0, 1, 0.01);
        this.gui.add(this, 'penumbra', 0, 5, 0.01);
        this.gui.add(this, 'intensity', 0, 5, 0.01);
        this.gui.add(this, 'angle', 0, 1, 0.01);
    }

}