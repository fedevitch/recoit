import { readFile } from 'fs/promises';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        }),
    ),
    transports: [        
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

const FILE = './test-data/чек 2-2.jpeg';

(async () => {
    try {
        logger.info('Reading file');
        const rawFile = await readFile(FILE);
        logger.info('Converting to b-w');
        const bwImage = await sharp(rawFile)
            //.toColourspace('b-w')
            .grayscale()
            .threshold(196)
            //.toBuffer()
            .toFile('tmp.jpg');

        logger.info('Doing ocr');
        const worker = await createWorker(['ukr', 'eng'], 3, { logger: logger.debug });
        const ret = await worker.recognize('tmp.jpg');
        console.log(ret.data.text);
        await worker.terminate();
    } catch (e) {
        logger.error(e);
    }
})();