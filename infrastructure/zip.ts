import AdmZip from 'adm-zip'

const zip = new AdmZip()

zip.addLocalFile('./dist/lambda.js')
zip.addLocalFile('./dist/lambda.js.map')
zip.writeZip('./dist/lambda.zip')

console.log('created ./dist/lambda.zip')
