 // URL to the CSV file hosted on GitHub
 const csvFilePath = 'https://raw.githubusercontent.com/shaktids/stock_app_test/main/dump.csv';
 let indexData = []; // Cache for parsed CSV data
 let chartInstance = null; // Store the Chart.js instance

 // Parsing CSV using PapaParse
 Papa.parse(csvFilePath, {
    download: true,
    header: true,
    worker: true,  // Enable worker to offload processing to a background thread
    complete: function(results) {
        indexData = results.data;
        populateIndexList(indexData);
        document.getElementById('loadingSpinner').style.display = 'none'; // Hide spinner after loading
        if (indexData.length > 0) {
            updateChart(indexData[0]); // Pass the first index data
        }
    }
});


 // Populate the sidebar with index names
 function populateIndexList(data) {
     const indexList = document.getElementById('indexList');
     data.forEach(index => {
         const div = document.createElement('div');
         div.className = 'index-name';
         div.textContent = index['index_name']; // Assuming the CSV has a column named 'index_name'
         div.addEventListener('click', () => updateChart(index));
         indexList.appendChild(div);
     });
 }

 // Function to update the chart with selected index's data
 function updateChart(index) {
     // Destroy the previous chart instance if it exists
     if (chartInstance) {
         chartInstance.destroy();
     }

     const ctx = document.getElementById('indexChart').getContext('2d');
     chartInstance = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: ['Open', 'High', 'Low', 'Close', 'Points Change', 'Change %', 'Volume', 'Turnover Rs Cr', 'PE Ratio', 'PB Ratio', 'Div Yield'],
             datasets: [{
                 label: `${index['index_name']} (${index['index_date']})`,
                 data: [
                     parseFloat(index['open_index_value']),
                     parseFloat(index['high_index_value']),
                     parseFloat(index['low_index_value']),
                     parseFloat(index['closing_index_value']),
                     parseFloat(index['points_change']),
                     parseFloat(index[' change_percent']),
                     parseFloat(index['volume']),
                     parseFloat(index['turnover_rs_cr']),
                     parseFloat(index['pe_ratio']),
                     parseFloat(index['pb_ratio']),
                     parseFloat(index['div_yield'])
                 ],
                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
                 borderColor: 'rgba(75, 192, 192, 1)',
                 borderWidth: 2
             }]
         },
         options: {
            scales: {
                y: {
                    type: 'logarithmic',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }       
     });
 }


 // Show loader
document.getElementById('loadingScreen').classList.remove('hidden');

// Simulate data loading process
Papa.parse(csvFilePath, {
    download: true,
    header: true,
    complete: function(results) {
        indexData = results.data;
        populateIndexList(indexData);
        document.getElementById('loadingScreen').classList.add('hidden'); // Hide loader after data is loaded
    }
});
