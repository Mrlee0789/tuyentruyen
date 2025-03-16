const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'temp_uploads/' });

app.use(cors());
app.use(express.static('public'));

app.post('/upload', upload.single('photo'), async (req, res) => {
  const filePath = req.file.path;
  const fileStream = fs.createReadStream(filePath);

  const form = new FormData();
  form.append('UPLOADCARE_PUB_KEY', '830b3ce89606cea831ba');
  form.append('UPLOADCARE_STORE', '1');
  form.append('file', fileStream);

  try {
    const response = await axios.post('https://upload.uploadcare.com/base/', form, {
      headers: form.getHeaders()
    });
    const fileUrl = `https://ucarecdn.com/${response.data.file}/`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Lỗi khi upload lên Uploadcare:', error);
    res.status(500).json({ error: 'Lỗi khi upload' });
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});