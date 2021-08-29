const router = require('express').Router()
const multiparty = require('multiparty')

const { BlobServiceClient, ContainerClient } = require('@azure/storage-blob')
const sasToken = process.env.SAS_TOKEN
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME
const getBlobService = () =>
  new BlobServiceClient(
    `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${process.env.SAS_TOKEN}`
  )
const createContainer = async (containerName) => {
  const blobService = getBlobService()
  const containerClient = blobService.getContainerClient(containerName)
  try {
    await containerClient.createIfNotExists({
      access: 'container',
    })
  } catch (err) {}
}

const createBlobInContainer = async (containerClient, file, fileName) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(fileName)

  // set mimetype as determined from browser with file upload control

  // upload file
  await blobClient.uploadFile(file.path)
}

const uploadFileToBlob = async (file, fileName, containerName) => {
  if (!file) return []

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = getBlobService()

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName)
  // upload file
  await createBlobInContainer(containerClient, file, fileName)
}

router.post('/createContainer', async (req, res) => {
  try {
    await createContainer(req.body.id)
    res.status(200).send('Container Created')
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/upload', async (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, async function (err, fields, files) {
    await uploadFileToBlob(files.file[0], fields.fileName, fields.containerName)
    res.status(200).send('File uploaded successfully')
  })
})

module.exports = router
