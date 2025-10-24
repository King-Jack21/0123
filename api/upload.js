import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// buat folder uploads kalau belum ada
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// handler upload
export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      const fileUrl = `${req.headers.origin}/uploads/${req.file.filename}`;
      res.status(200).json({ url: fileUrl });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
