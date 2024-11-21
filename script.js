let allResults = [];
let currentIndex = 0;
const resultsPerPage = 10;

function searchICD10() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const keywords = input.split(/\s+/).filter(word => word); // Split input into words and remove empty entries
    const resultDiv = document.getElementById('result');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    resultDiv.innerHTML = '';
    viewMoreBtn.style.display = 'none';
    currentIndex = 0;

    fetch('icd10.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip header row
            allResults = rows.filter(row => {
                const [code, description] = row.split(',');
                if (code && description) {
                    const lowerDescription = description.toLowerCase();
                    return keywords.every(keyword => 
                        code.toLowerCase().includes(keyword) || lowerDescription.includes(keyword)
                    );
                }
                return false;
            });

            if (allResults.length > 0) {
                displayResults();
                if (allResults.length > resultsPerPage) {
                    viewMoreBtn.style.display = 'block';
                }
            } else {
                resultDiv.innerHTML = '<p>No results found</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>Error loading CSV file</p>';
        });
}

function displayResults() {
    const resultDiv = document.getElementById('result');
    const endIndex = Math.min(currentIndex + resultsPerPage, allResults.length);
    for (let i = currentIndex; i < endIndex; i++) {
        const [code, description] = allResults[i].split(',');
        resultDiv.innerHTML += `<p><strong>${code}</strong>: ${description}</p>`;
    }
    currentIndex = endIndex;
}

function viewMoreResults() {
    displayResults();
    if (currentIndex >= allResults.length) {
        document.getElementById('viewMoreBtn').style.display = 'none';
    }
}
