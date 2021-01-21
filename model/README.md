# Model
Used tensorflow 2 to create a CNN model. <br>

## Summary:  `model.summary()`

<pre>
Model: "sequential_4"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d_8 (Conv2D)            (None, 26, 26, 24)        240       
_________________________________________________________________
max_pooling2d_8 (MaxPooling2 (None, 13, 13, 24)        0         
_________________________________________________________________
conv2d_9 (Conv2D)            (None, 11, 11, 36)        7812      
_________________________________________________________________
max_pooling2d_9 (MaxPooling2 (None, 5, 5, 36)          0         
_________________________________________________________________
flatten_4 (Flatten)          (None, 900)               0         
_________________________________________________________________
dense_8 (Dense)              (None, 128)               115328    
_________________________________________________________________
dense_9 (Dense)              (None, 10)                1290      
=================================================================
Total params: 124,670
Trainable params: 124,670
Non-trainable params: 0
</pre>

## Converting it to a tfjs model: 
Then, one can use `tfjs-converter` to convert it to a tfjs model:  
<br>
`tensorflowjs_converter --input_format keras cnn_model.h5 ../server/model/working_model`

## Requirements: (According to what I remember...)
- tensorflow-gpu/cpu 2.*
- matplotlib
- numpy
- pillow
