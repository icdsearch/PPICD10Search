let allResults = [];
let currentIndex = 0;
const resultsPerPage = 10;

function searchICD10() {
    const input = document.getElementById('searchInput').value.toLowerCase();
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
                return code && description && (code.toLowerCase().includes(input) || description.toLowerCase().includes(input));
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