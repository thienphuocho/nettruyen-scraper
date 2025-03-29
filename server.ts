import dotenv from 'dotenv';
import app from './src/app';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server chạy tại http://${HOST}:${PORT}`);
});
