const fs = require("fs");
const File = require("../models/file");

const uploadFile = async (req, res) => {
  const file = req.file;
  const newFile = await File.create(file);
  res.status(201).send(newFile);
};

const getFile = async (req, res) => {
  const id = req.params.id;
  const file = await File.findOne({ where: { id } });
  res.status(200).send(file);
};

const getAllFiles = async (req, res) => {
  let { list_size, page } = req.query;
  if (!list_size) list_size = 10;
  if (!page) page = 1;
  const limit = parseInt(list_size);
  const offset = (page - 1) * list_size;
  const files = await File.findAll({ limit, offset });
  res.status(200).send(files);
};

const deleteFile = async (req, res) => {
  const id = req.params.id;
  const file = await File.findOne({ where: { id } });
  if (!file) {
    res.status(404).send({ message: "File not found" });
    return;
  }
  fs.unlink(file.path, (err) => {
    if (err) {
      res.status(500).send({ message: "Error deleting file" });
      return;
    }
  });

  await file.destroy();

  res.status(200).send({ message: "File deleted" });
};

const updateFile = async (req, res) => {
  const id = req.params.id;
  const file = await File.findOne({ where: { id } });
  if (!file) {
    res.status(404).send({ message: "File not found" });
    return;
  }
  const updatedFile = await file.update(req.file);
  res.status(200).send(updatedFile);
};

const downloadFile = async (req, res) => {
  const id = req.params.id;
  const file = await File.findOne({ where: { id } });
  if (!file) {
    res.status(404).send({ message: "File not found" });
    return;
  }
  res.download(file.path);
};

module.exports = {
  uploadFile,
  getFile,
  getAllFiles,
  deleteFile,
  updateFile,
  downloadFile,
};
