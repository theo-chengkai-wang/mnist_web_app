const tf = require('@tensorflow/tfjs-node');
const { exception } = require('console');
const fs = require('fs');

const MODELPATH = __dirname + '/model/cnn_model/model.json';

let model = null;

const loadModel = async () => {
    model = await tf.loadLayersModel('file://'+MODELPATH);
    console.log('model loaded');
}


const predictFromImage = async (imagePath, reverseColor=1) => {
    if (model==null) {
        await loadModel();
    }
    const image = fs.readFileSync(imagePath);
    let image_tensor = tf.node.decodePng(image, 1);
    image_tensor = image_tensor.resizeBilinear([28, 28]);
    if (reverseColor==1) {
        image_tensor = image_tensor.add(-255).mul(-1);
    }
    image_tensor = image_tensor.mean(-1).mul(1.0/255.0).expandDims(0).expandDims(-1);
    const predictions = model.predict(image_tensor).flatten();
    const p = await predictions.argMax().data();
    const proba = await predictions.data();
    return [p[0], proba[p[0]]];
}


const predictFromArray = async (array) => {
    if (model==null) {
        await loadModel();
    }
    let image_tensor = tf.tensor(array);
    // Just for test
    // console.log(image_tensor.shape)
    fs.writeFileSync('./test/test.png', await tf.node.encodePng(image_tensor.mul(255).expandDims(-1)));
    // Just for test
    image_tensor = image_tensor.expandDims(0).expandDims(-1);
    const predictions = model.predict(image_tensor).flatten();
    predictions.print();
    const p = await predictions.argMax().data();
    const proba = await predictions.data();
    return [p[0], proba[p[0]]];
}
// predictFromImage('./test/2.png').then(console.log).catch((reason) => {
//     if(reason instanceof ModelNotFoundError) {
//         console.log("not loaded yet");
//     }
// });
// loadModel().then(()=>predictFromImage('./test/2.png')).then(console.log);

module.exports = {
    predictFromArray: predictFromArray,
    predictFromImage: predictFromImage
};