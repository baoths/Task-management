/**
 * Script import dữ liệu MongoDB từ file JSON
 * Chạy: node scripts/importDB.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importDatabase() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Đã kết nối MongoDB');

        const db = mongoose.connection.db;
        
        // Đọc file backup
        const inputFile = path.join(__dirname, '../../database_export/todo-app-backup.json');
        
        if (!fs.existsSync(inputFile)) {
            console.error('Không tìm thấy file backup:', inputFile);
            process.exit(1);
        }

        const backupData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        
        for (const [collectionName, documents] of Object.entries(backupData)) {
            if (documents.length > 0) {
                // Xóa dữ liệu cũ
                await db.collection(collectionName).deleteMany({});
                
                // Import dữ liệu mới
                await db.collection(collectionName).insertMany(documents);
                console.log(`Đã import: ${collectionName} (${documents.length} documents)`);
            }
        }

        console.log('\nImport thành công!');
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Lỗi:', error.message);
        process.exit(1);
    }
}

importDatabase();
