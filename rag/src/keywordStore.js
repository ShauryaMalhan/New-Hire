// Simple In-Memory Keyword Search (BM25-style logic)
let documentCache = [];

export function buildKeywordIndex(chunks) {
    documentCache = chunks.map(chunk => chunk.pageContent);
    console.log(`✅ Keyword Index built with ${documentCache.length} entries.`);
}

export function searchKeywordDB(query, k = 3) {
    if (documentCache.length === 0) return [];

    const queryTerms = query.toLowerCase().split(/\s+/);
    
    // Score every document based on how many keywords it contains
    const scores = documentCache.map((doc, index) => {
        const lowerDoc = doc.toLowerCase();
        let score = 0;
        
        queryTerms.forEach(term => {
            if (lowerDoc.includes(term)) score += 1;
        });
        
        return { index, score, content: doc };
    });

    // Sort by highest score first
    return scores
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map(item => item.content);
}