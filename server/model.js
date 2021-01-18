const tf = require('@tensorflow/tfjs-node')
const { assert } = require('console')
const fs = require('fs')
const EventEmitter = require('events').EventEmitter;

const MODELPATH = './model/working_model/'
const TEST = 'TEST'
const TRAIN = 'TRAIN'
const TRAINSIZE = 10

/**
 * Model for MNIST
 * @field MODELPATH - directory path to model.json
 * @field model - null or tf.LayersModel -- Lazily initialized
 * @field imageBatch - tf.Tensor3d array
 */
class CNNModel extends EventEmitter {

    MODELPATH = null
    model = null
    TRAINSIZE = 0
    imageBatch = []
    imageLabels = []

    constructor(modelPath, trainSize=10) {
        super()
        this.MODELPATH = modelPath
        this.TRAINSIZE = trainSize
    }

    empty() {
        this.imageBatch = []
        this.imageLabels = []
    }

    async loadModel() {
        console.log(new Date().toISOString() + ': initializing & loading model')
        assert(this.MODELPATH!==null, 'MODELPATH is null')
        this.model = await tf.loadLayersModel('file://'+ this.MODELPATH +'/model.json')
        this.model.compile({optimizer: tf.train.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy']})
        this.emit('modelLoaded')
    }

    /**
     * 
     * @param {number} train_size Size of traning data
     * @param {tf.Tensor<tf.Rank.R4>} xs - Data of shape [train_size, 28, 28, 1]
     * @param {tf.Tensor<tf.Rank.R1>} ys - One hot encoded labels, of shape [train_size]
     */
    async performGradientDescent(trainSize=this.TRAINSIZE, xs=tf.stack(this.imageBatch), ys=this.imageLabels) {
        if (this.model == null) {
            await this.loadModel()
        }
        console.log(new Date().toISOString() + ': Performing gradient descent on the --' + trainSize + '-- images provided')
        tf.util.assert(trainSize === xs.shape[0], 'Shape mismatch with train size')
        const ysOneHot = tf.oneHot(ys, 10)
        // Do one epoch
        const history = await this.model.fit(xs, ysOneHot, {
            epochs : 1,
            batchSize: trainSize,
        })
        console.log(new Date().toISOString(), ': Accuracy ', history.history.acc)
        await this.model.save('file://'+this.MODELPATH)
    }


    // TODO make it available on train
    /**
     * ONLY AVAILABLE ON TEST
     * 
     * @param {string} imagePath - path to png image in question
     * @param {number} reverseColor - 0 or 1 
     */
    async predictFromImage (imagePath, reverseColor=1) {
        if (this.model == null) {
            await this.loadModel()
        }
        assert(reverseColor==0 || reverseColor==1)
        const image = fs.readFileSync(imagePath);
        let image_tensor = tf.node.decodePng(image, 1);
        image_tensor = image_tensor.resizeBilinear([28, 28]);
        if (reverseColor==1) {
            image_tensor = image_tensor.add(-255).mul(-1);
        }
        image_tensor = image_tensor.mean(-1).mul(1.0/255.0).expandDims(-1);
        image_tensor = image_tensor.expandDims(0);
        const predictions = this.model.predict(image_tensor).flatten();
        const p = await predictions.argMax().data();
        const proba = await predictions.data();
        return {prediction: p[0], probability: proba[p[0]]};    
    }

    /**
     * 
     * @param {number[][]} array - a 28 by 28 array, with values between 0 and 1.
     */
    async predictFromArray(array) {
        /*assert(this.mode===TEST || label != -1, 'mode is not test and label is -1')*/
        assert(array.length == 28 && array[0].length == 28, `array doesn't fit`)
        if (this.model == null) {
            await this.loadModel()
        }
        console.log(new Date().toISOString(), ': predicting from array')
        let image_tensor = tf.tensor(array);
        // Just for test
        // console.log(image_tensor.shape)
        fs.writeFileSync('./test.png', await tf.node.encodePng(image_tensor.mul(255).expandDims(-1)));
        // Just for test
        image_tensor = image_tensor.expandDims(-1);
        const predictions = this.model.predict(image_tensor.expandDims(0)).flatten();
        predictions.print();
        const p = await predictions.argMax().data();
        const proba = await predictions.data();

        /*if (this.mode === TRAIN) {
            // append image tensor to the batch
            this.imageBatch.push(tf.clone(image_tensor));
            this.imageLabels.push(label);
            let imageId = this.imageBatch.length-1
            this.emit('addedImageToBatch', {
                imageId: imageId,
                prediction: p[0], 
                label: label
            });
            if(this.imageLabels.length === this.TRAINSIZE) {
                this.emit('imageBatchFull')
            }
        }*/
        return {prediction: p[0], probability: proba[p[0]]};
    }

    /**
     * ONLY AVAILABLE ON TRAIN MODE
     * @param {number[][]} array 28*28 
     * @param {number} label 0-9
     */
    appendImageLabelCouple(array, label) {
        this.imageLabels.push(label)
        this.imageBatch.push(tf.tensor(array).expandDims(-1))
        let imageId = this.imageBatch.length-1
        this.emit('addedImageToBatch', {
            imageId: imageId,
            label: label
        });
        if(this.imageLabels.length === this.TRAINSIZE) {
            this.emit('imageBatchFull')
        }
        return {
           success: true,
           imageId: imageId 
        };
    }

}

const instance = new CNNModel(MODELPATH, TRAINSIZE)

instance.on('addedImageToBatch', ({imageId, prediction, label})=> {
    console.log(new Date().toISOString(), ': added image ', imageId, ' to batch', ' compared to answer: ', label)
})

instance.on('imageBatchFull', async ()=> {
    console.log(new Date().toISOString(), ': Image batch full')
    await instance.performGradientDescent()
    instance.empty()
})

instance.on('modelLoaded', () => {
    console.log(new Date().toISOString()+': model loaded')
})


//Object.freeze(instance)
module.exports = {constants: {TRAIN, TEST}, model: instance}

// TEST 

//const MODELPATH = './cnn_model'
/*
let model = null


const loadModel = async () => {
    let cnn_model = await tf.loadLayersModel('file://'+MODELPATH+'/model.json')
    cnn_model.compile({optimizer: tf.train.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy']})
    console.log('model loaded')
    return cnn_model
}
*/
/**
 * 
 * @param {number} train_size Size of traning data
 * @param {tf.Tensor<tf.Rank.R4>} xs - Data of shape [train_size, 28, 28, 1]
 * @param {tf.Tensor<tf.Rank.R1>} ys - One hot encoded labels, of shape [train_size]
 */
/*
const performGradientDescent = async (trainSize, xs, ys) => {
    console.log(new Date().toISOString() + ': Performing gradient descent on the -' + trainSize + '- images provided')
    tf.util.assert(trainSize === xs.shape[0], 'Shape mismatch with train size')
    if (model == null) {
        console.log(new Date().toISOString() + ': loading model')
        model = await loadModel()
    }
    const ysOneHot = tf.oneHot(ys, 10)
    // Do one epoch
    const history = await model.fit(xs, ysOneHot, {
        epochs : 1,
        batchSize: trainSize,
    })
    console.log(new Date().toISOString(), ': Accuracy ', history.history.acc)
    await model.save('file://'+MODELPATH)
}

module.exports = {performGradientDescent}*/

// Testing

const getImage = async (imagePath, reverseColor=1) => {
    const image = fs.readFileSync(imagePath);
    let imageTensor = tf.node.decodePng(image, 1);
    imageTensor = imageTensor.resizeBilinear([28, 28]);
    if (reverseColor==1) {
        imageTensor = imageTensor.add(-255).mul(-1);
    }
    imageTensor = imageTensor.mean(-1).mul(1.0/255.0);
    return imageTensor;
}

/*const test = async () => {
    if (model==null) {
        model = await loadModel();
    }
    let data = tf.stack([await getImage('./1.png', 1), await getImage('./2.png', 1), await getImage('./8.png', 0)])
    let train_size = 3
    let labels = tf.tensor([1,2,8], null, "int32")
    await performGradientDescent(train_size, data, labels)
    let pred = model.predict(data)
    pred.print()
}*/

//test()

const test2 = async () => {
    testInstance.setMode('TRAIN')
    //let data = tf.stack([await getImage('./1.png', 1), await getImage('./2.png', 1), await getImage('./8.png', 0)])
    // let labels = tf.tensor([1,2,8], null, "int32")
    // await cnnModel.performGradientDescent(train_size, data, labels)
    for (let obj of [{data: await getImage('./1.png', 1), label: 1}, {data: await getImage('./2.png', 1), label: 2}, {data: await getImage('./8.png', 0), label: 8}]) {
        let img = obj.data
        let label = obj.label
        let i = await img.array()
        await testInstance.predictFromArray(i, label)
    }
}

//test2()