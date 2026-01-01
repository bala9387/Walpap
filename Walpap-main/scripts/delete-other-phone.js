
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/lib/placeholder-images.json');
const wallpapersDir = path.join(__dirname, '../public/wallpapers');

function removeOtherPhoneImages() {
    try {
        if (!fs.existsSync(jsonPath)) {
            console.log('JSON database not found.');
            return;
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const layouts = data.placeholderImages;

        console.log(`Total images before: ${layouts.length}`);

        // Identify images to remove
        const toRemove = layouts.filter(img => img.category === 'other' && img.device === 'phone');
        console.log(`Found ${toRemove.length} images to remove in 'other phone' category.`);

        // Filter valid images
        const validImages = layouts.filter(img => !(img.category === 'other' && img.device === 'phone'));

        // Delete files
        let deletedCount = 0;
        toRemove.forEach(img => {
            const filename = path.basename(img.imageUrl);
            const filePath = path.join(wallpapersDir, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        console.log(`Deleted ${deletedCount} files from disk.`);

        // Save JSON
        const newData = { placeholderImages: validImages };
        fs.writeFileSync(jsonPath, JSON.stringify(newData, null, 2));
        console.log(`Total images after: ${validImages.length}`);
        console.log('Update complete!');

    } catch (err) {
        console.error('Error:', err);
    }
}

removeOtherPhoneImages();
