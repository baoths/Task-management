/**
 * Script xuất dữ liệu MongoDB ra file JSON
 * Chạy: node scripts/exportDB.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function exportDatabase() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Đã kết nối MongoDB');

        const db = mongoose.connection.db;
        
        // Lấy tất cả collections
        const collections = await db.listCollections().toArray();
        
        const exportData = {};
        
        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await db.collection(collectionName).find({}).toArray();
            exportData[collectionName] = data;
            console.log(`📦 Đã export: ${collectionName} (${data.length} documents)`);
        }

        // Tạo folder output
        const outputDir = path.join(__dirname, '../../database_export');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Lưu file JSON
        const outputFile = path.join(outputDir, 'todo-app-backup.json');
        fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2), 'utf8');
        
        console.log('\n Export thành công!');
        console.log(` File: ${outputFile}`);
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Lỗi:', error.message);
        process.exit(1);
    }
}

exportDatabase();
