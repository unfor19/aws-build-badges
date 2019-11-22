# Create Text-To-Svg Lambda Layer
The path layers/text-to-svg/**nodejs/nodemodules** is important.
This is how AWS makes this module available to the Lambda Function.
Read more about it here - [AWS Including Library Dependencies in a Layer
](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path)

Execute the code:
```
cd layers/text-to-svg/nodejs
yarn addlayer
```
This will create a `node_modules` folder with text-to-svg and relevant dependencies.
If you wonder what it does, look at the scripts section in the [package.json](./package.json) file.