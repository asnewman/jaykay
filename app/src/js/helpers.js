const BASE_URL = 'http://localhost:3000';

async function getDocuments() {
  const response = await fetch(`${BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const documents = await response.json()
  window.store.documents = documents;
}

export {getDocuments};