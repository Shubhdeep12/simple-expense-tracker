import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data.json');

export async function getTypes() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.types || [];
  } catch (error) {
    // If file doesn't exist, create it with default types
    if (error.code === 'ENOENT') {
      const defaultTypes = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping'];
      await fs.writeFile(
        dataFilePath,
        JSON.stringify({ types: defaultTypes }),
        'utf8'
      );
      return defaultTypes;
    }
    throw error;
  }
}

export async function addNewType(newType) {
  try {
    const types = await getTypes();
    
    // Only add if the type doesn't already exist
    if (!types.includes(newType)) {
      types.push(newType);
      await fs.writeFile(
        dataFilePath,
        JSON.stringify({ types }),
        'utf8'
      );
    }
    
    return types;
  } catch (error) {
    console.error('Error adding new type:', error);
    throw error;
  }
}