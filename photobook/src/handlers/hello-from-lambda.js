const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const sharp = require('sharp')

exports.helloFromLambdaHandler = async (event, context) => {
    const {bucket,object} = event.Records[0].s3
    console.log({bucket,object})
    const s3Object = await s3.getObject({
        Bucket: bucket.name,
        Key: object.key
      }).promise()
      
      const data = await sharp(s3Object.Body)
          .resize(200)
          .jpeg({ mozjpeg: true })
          .toBuffer()
      
      const result = await s3.putObject({
        Bucket: 'serverless-resize-photobook', 
        Key: object.key,
        ContentType: 'image/jpeg',
        Body: data,
        ACL: 'public-read'
      }).promise()

    const message = 'Hello from Lambda!';

    console.info(`${message}`);
    
    return message;
}
