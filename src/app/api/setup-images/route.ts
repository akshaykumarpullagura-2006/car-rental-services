import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const srcDir = 'C:\\Users\\aksha\\.gemini\\antigravity-ide\\brain\\3c7934f6-cd23-4d02-8326-7c018dfe130c';
    const destDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = [
      { src: 'media__1785762465365.png', dest: 'swift-3d.png' },
      { src: 'media__1785762591038.jpg', dest: 'thar-3d.jpg' },
      { src: 'media__1785762701226.png', dest: 'fortuner-3d.png' }
    ];

    const results: string[] = [];

    files.forEach(f => {
      const srcPath = path.join(srcDir, f.src);
      const destPath = path.join(destDir, f.dest);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        results.push(`Copied ${f.src} -> public/images/${f.dest}`);
      } else {
        results.push(`NotFound: ${srcPath}`);
      }
    });

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
