const http = require('http');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const port = 8081;
const s3Bucket = 'manjeetyadavrajokri'; // Replace with your S3 bucket name

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the HTML file
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error reading HTML file');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/files') {
    // Serve the list of files from S3 bucket
    const s3 = new AWS.S3();
    const params = {
      Bucket: s3Bucket
    };

    s3.listObjects(params, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Error retrieving file list' }));
      } else {
        const fileList = data.Contents.map(obj => ({
          name: obj.Key,
          url: `https://${s3Bucket}.s3.amazonaws.com/${obj.Key}`
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(fileList));
      }
    });
  } else if (req.url.startsWith('/files/')) {
    // Serve the requested file from S3 bucket
    const requestedFile = req.url.slice(7); // Remove '/files/' from the URL
    const s3 = new AWS.S3();
    const params = {
      Bucket: s3Bucket,
      Key: requestedFile
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error retrieving file');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(data.Body);
      }
    });
  } else {
    // Handle invalid URLs
    res.writeHead(404);
    res.end('Invalid URL');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

